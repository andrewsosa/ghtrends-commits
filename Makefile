.PHONY: clean dev prod

clean:
	rm -rf .build

dev: clean
	serverless deploy -s dev

prod: clean
	serverless deploy -s prod
