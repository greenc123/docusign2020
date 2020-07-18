SHELL=/bin/bash

define get_value_dotenv_or_env =
	test -f $(1)/.env && { test $(shell grep $(2) $(1)/.env) && grep $(2) $(1)/.env | cut -d '=' -f2; } || env | grep $(2) | cut -d '=' -f2
endef

BACKEND := $(or ${BACKEND},${BACKEND},localhost:4000)
export ACCOUNT_ID=$(shell $(call get_value_dotenv_or_env,server,ACCOUNT_ID))
export ACCESS_TOKEN=$(shell $(call get_value_dotenv_or_env,server,ACCESS_TOKEN))

.PHONY: docker
docker:
	docker-compose up --build
