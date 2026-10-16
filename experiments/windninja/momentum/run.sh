#!/bin/bash
# 1つの解法・1方位を解く（調査・findings-04）。使い方: run.sh <mass|mom> <方位> <地形.tif> <作業ディレクトリ>
# 環境変数 WN（WindNinja のビルドとソースの親）。mom は OpenFOAM 11 を使う
set -euo pipefail
SOLVER=$1; DIR=$2; DEM=$3; WORK=$4
OD="$WORK/${SOLVER}_${DIR}"; mkdir -p "$OD"
MOM=false; [[ "$SOLVER" == mom ]] && MOM=true
cat > "$OD/run.cfg" <<CFG
num_threads = $(nproc)
elevation_file = $DEM
initialization_method = domainAverageInitialization
input_speed = 10.0
input_speed_units = mps
input_direction = $DIR
input_wind_height = 10.0
units_input_wind_height = m
output_wind_height = 10.0
units_output_wind_height = m
output_speed_units = mps
vegetation = grass
momentum_flag = $MOM
mesh_resolution = 60
units_mesh_resolution = m
write_ascii_output = true
ascii_out_resolution = 60
units_ascii_out_resolution = m
output_path = $OD
CFG
# 運動量の解法は mesh_resolution ではなく mesh_choice を使う版がある（失敗したらログに出る）
s=$(date +%s)
# 通信の無い名前空間で動かす。OpenFOAM の環境を読み込んでから（WM_PROJECT_VERSION で版を見分ける）
# ⚠ 新しい名前空間ではループバック（lo）が DOWN のまま。OpenMPI はプロセス間の連絡に TCP（lo）を使うので上げる（外への通信は無いまま）
sudo -E unshare -n bash -c "
  ip link set lo up
  export OMPI_ALLOW_RUN_AS_ROOT=1 OMPI_ALLOW_RUN_AS_ROOT_CONFIRM=1 WINDNINJA_DATA='$WN/src/data'
  [[ -f /opt/openfoam11/etc/bashrc ]] && source /opt/openfoam11/etc/bashrc
  cd '$OD' && '$WN/build/src/cli/WindNinja_cli' run.cfg
" > "$OD/log.txt" 2>&1 || { tail -40 "$OD/log.txt"; exit 1; }
echo "$SOLVER $DIR: $(( $(date +%s) - s )) 秒"
