#!/usr/bin/env bash

functional:all() {
    /var/www/vendor/bin/phpunit -c ./Build/phpunit/FunctionalTests.xml
}

functional:single() {
	local file
	file=$(find /var/www/vendor/toumoro/tm-qa-tools/Tests/Functional/ -name "$1.php" | head -n 1)

	if [ -z "$file" ]; then
		echo "❌ Test file \"$1\" not found."
		exit 1
	fi

	/var/www/vendor/bin/phpunit -c ./Build/phpunit/FunctionalTests.xml "$file"
}

"$@"