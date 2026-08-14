const prettier = require("prettier/standalone");
const phpPlugin = require("@prettier/plugin-php/standalone");

async function run() {
  try {
    const res = await prettier.format("<?php echo 'hello'; ?> <div>HTML</div>", {
      parser: "php",
      plugins: [phpPlugin]
    });
    console.log("SUCCESS:", res);
  } catch (err) {
    console.error("ERROR:", err.message, err.stack);
  }
}
run();
