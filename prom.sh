docker run -d \
    --name prometheus \
    --network="host" \
    -v "$(pwd)/prometheus-data":/prometheus-data \
    prom/prometheus \
    -config.file=/prometheus-data/prometheus.yml