reset:
	npx prisma migrate reset --schema=src/prisma/schema.prisma

dev:
	npx prisma migrate dev --schema=src/prisma/schema.prisma

.PHONY: reset dev