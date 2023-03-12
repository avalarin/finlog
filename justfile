clean:
    rm -rf digitalocean/lib

build: clean
    cd core && npm install
    cd core && npx tsc -p ./tsconfig.json

    mkdir digitalocean/lib
    cp -r core/dist digitalocean/lib/core
