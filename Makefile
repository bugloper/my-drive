reset:
	npx prisma migrate reset

dev:
	npx prisma migrate dev

.PHONY: reset dev