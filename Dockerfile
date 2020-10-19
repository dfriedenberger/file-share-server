FROM balenalib/raspberry-pi-node

RUN install_packages git
RUN git clone https://github.com/dfriedenberger/simple-file-share-server.git
RUN npm i
EXPOSE 3000
ENTRYPOINT [ "sh", "-c", "node index.js"]

