docker stop db
docker stop backend
docker rm -f db
docker rm -f backend
docker volume rm relatedpartyfilling_pgdata
docker rmi relatedpartyfilling-backend:latest
cd front
call npm install
call npm run build
xcopy .\dist ..\back\static /e /Y /d
cd ..
docker-compose up -d