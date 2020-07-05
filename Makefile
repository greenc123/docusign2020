MONGODB_PASSWORD_DEFAULT=test

define get_value_dotenv_or_env =
	test -f $(1)/.env && { test $(shell grep $(2) $(1)/.env) && grep $(2) $(1)/.env | cut -d '=' -f2; } || env | grep $(2) | cut -d '=' -f2
endef

.PHONY: validate_mongodb_pass
validate_mongodb_pass:
	test "$(MONGODB_PASSWORD)" && return 0 || { echo "WARNING: Setting the MONGODB_PASSWORD environment variable to default of $(MONGODB_PASSWORD_DEFAULT)..." && export MONGODB_PASSWORD=$(MONGODB_PASSWORD_DEFAULT); }

.PHONY: load_env_backend
load_env_backend:
	export ACCOUNT_ID=$(shell $(call get_value_dotenv_or_env,server,ACCOUNT_ID))
	export ACCESS_TOKEN=$(shell $(call get_value_dotenv_or_env,server,ACCESS_TOKEN))


.PHONY: docker
docker: load_env_backend
	docker-compose up --build
