#!/bin/bash
# 1つの解法・1方位を解く（調査・findings-04）。使い方: run.sh <mass|mom> <方位> <地形.tif> <作業ディレクトリ>
# 環境変数 WN（WindNinja のビルドとソースの親）。mom は OpenFOAM 11 を使う
set -euo pipefail
SOLVER=$1; DIR=$2; DEM=$3; WORK=$4
MOM=false; [[ "$SOLVER" == mom ]] && MOM=true
# ⚠ 運動量の解法は物理コアの数までしか使えない（1回目：num_threads 4 > maxNumCores 2 で止まった）
# 升目：質量保存は 60m。運動量は MESH_COUNT（升目の総数）を渡せば mesh_count で（既定は 60m 指定）
if [[ "$SOLVER" == mom && -n "${MESH_COUNT:-}" ]]; then MESH_LINES="mesh_count = $MESH_COUNT"; TAG="_n$MESH_COUNT"
else MESH_LINES=$'mesh_resolution = 60\nunits_mesh_resolution = m'; TAG=""; fi
NT=$(nproc); [[ "$SOLVER" == mom ]] && NT=$(lscpu -p=Core,Socket | grep -v '^#' | sort -u | wc -l)
OD="$WORK/${SOLVER}_${DIR}${TAG}"; mkdir -p "$OD"
cat > "$OD/run.cfg" <<CFG
num_threads = $NT
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
$MESH_LINES
write_ascii_output = true
ascii_out_resolution = 60
units_ascii_out_resolution = m
output_path = $OD
CFG
# 升目は mesh_resolution（4.0.0 の CLI で運動量の解法にも使えることを確かめた。mesh_choice とは同時に使えない）
s=$(date +%s)
# 通信の無い名前空間で動かす。OpenFOAM の環境を読み込んでから（WM_PROJECT_VERSION で版を見分ける）
# ⚠ 新しい名前空間ではループバック（lo）が DOWN のまま。OpenMPI はプロセス間の連絡に TCP（lo）を使うので上げる（外への通信は無いまま）
sudo -E unshare -n bash -c "
  ip link set lo up
  export OMPI_ALLOW_RUN_AS_ROOT=1 OMPI_ALLOW_RUN_AS_ROOT_CONFIRM=1 WINDNINJA_DATA='$WN/src/data'
  [[ -f /opt/openfoam11/etc/bashrc ]] && source /opt/openfoam11/etc/bashrc
  cd '$OD' && '$WN/build/src/cli/WindNinja_cli' run.cfg
" > "$OD/log.txt" 2>&1 || { tail -40 "$OD/log.txt"; exit 1; }
echo "$SOLVER $DIR$TAG: $(( $(date +%s) - s )) 秒・地形をならした回数 $(grep -c 'Smoothing elevation file' "$OD/log.txt" || true)"
