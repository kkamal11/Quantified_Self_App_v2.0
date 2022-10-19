export SECRET_KEY=` openssl rand -hex 20`
export SECURITY_PASSWORD_SALT=` openssl rand -hex 20`
export SECURITY_PASSWORD_HASH=bcrypt