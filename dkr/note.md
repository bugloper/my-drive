Terms:
1. Image(packaged software with depencies)
2. Container(running instance of image)
3. Registry(a place to store images)
4. Dockerfile(specs file for building images)
5. Dockerize(build docker image)

Commands:
1. List images: `docker image ls`
2. List Containers: `docker ps`
3. Run image: `docker run --name image-name -d -p 3000:3000  image-name`
4. Exec into container: `docker exec -it <container_id or container_name> sh`
5. Build image: `docker  build -t tag-name .`

