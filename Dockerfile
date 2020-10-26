FROM balenalib/raspberry-pi-node

RUN install_packages git
ADD https://api.github.com/repos/dfriedenberger/simple-file-share-server/git/refs/heads/master version.json
RUN git clone https://github.com/dfriedenberger/simple-file-share-server.git
RUN cd simple-file-share-server;npm i
EXPOSE 3000
ENTRYPOINT [ "sh", "-c", "cd simple-file-share-server;node index.js"]

