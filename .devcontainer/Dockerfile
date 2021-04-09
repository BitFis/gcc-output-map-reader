ARG VARIANT="15.14"
FROM node:${VARIANT}

RUN wget -L https://golang.org/dl/go1.16.3.linux-amd64.tar.gz -O /tmp/go1.16.3.linux-amd64.tar.gz \
    tar -C /usr/local -xzf /tmp/go1.16.3.linux-amd64.tar.gz \
    export PATH=$PATH:/usr/local/go/bin
