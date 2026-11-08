#!/bin/bash
# WindNinja を1回解く（調査）。WindNinja_cli と data/ は ../build・../src にある前提（README の手順）
# 使い方: run.sh <dem.tif> <風向> <風速> <升目m> <出力の接頭辞>
set -e
cat > /tmp/wn_$5.cfg <<CFG
num_threads                = 4
elevation_file             = $1
initialization_method      = domainAverageInitialization
input_speed                = $3
input_speed_units          = mps
input_direction            = $2
input_wind_height          = 10.0
units_input_wind_height    = m
output_wind_height         = 10.0
units_output_wind_height   = m
output_speed_units         = mps
vegetation                 = grass
mesh_resolution            = $4
units_mesh_resolution      = m
write_ascii_output         = true
ascii_out_resolution       = $4
units_ascii_out_resolution = m
output_path                = $PWD/out_$5
CFG
mkdir -p out_$5
s=$(date +%s.%N); WINDNINJA_DATA=$(dirname $0)/../src/data $(dirname $0)/../build/src/cli/WindNinja_cli /tmp/wn_$5.cfg > out_$5/log.txt 2>&1
echo "$5 $(echo "$(date +%s.%N)-$s" | bc)"
