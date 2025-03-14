docker stop relatedpartyfilling-db-1
docker stop relatedpartyfilling-backend-1
docker rm -f relatedpartyfilling-db-1
docker rm -f relatedpartyfilling-backend-1
docker volume rm relatedpartyfilling_pgdata
docker rmi relatedpartyfilling-backend:latest
cd front
call npm run build
xcopy .\dist ..\back\static /e /Y /d
cd ..
docker compose up -d