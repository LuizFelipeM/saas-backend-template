up:
	docker-compose -f docker-compose.yml up -d
up-recreate:
	docker-compose -f docker-compose.yml up -d --force-recreate
up-build:
	docker-compose -f docker-compose.yml up -d --build
up-build-recreate:
	docker-compose -f docker-compose.yml up -d --build --force-recreate
down:
	docker-compose -f docker-compose.yml down