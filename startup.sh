#!/bin/bash

# Install git and git-lfs if not installed
if ! command -v git-lfs &> /dev/null
then
    echo "Git LFS not found, installing..."
    apt-get update && apt-get install -y git \
    && curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash \
    && apt-get install -y git-lfs \
    && git lfs install
fi

# Pull LFS files
git lfs pull

# Start your application
uvicorn app.main:app --host 0.0.0.0 --port $PORT
