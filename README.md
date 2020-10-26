


Build Docker-Image
==================

```
$ docker build -t frittenburger/simple-file-share-server .
``` 
Run Image
=========
```
docker run -p 3000:3000 -d --rm frittenburger/simple-file-share-server
```