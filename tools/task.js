/**
 * File Name: tools/task.js
 * Created By: bobo2007
 * Creation Date: 2017-04-12 13:49:16
 * Last Modified: 2017-04-12 13:49:16
 * Purpose:
 */

function run(task, action, ...args) {
  const command = process.argv[2];
  const taskName = command && !command.startsWith('-') ? `${task}:${command}` : task;
  const start = new Date();
  console.log('111');
  process.stdout.write(`Starting '${taskName}'...\n`);
  return Promise.resolve().then(() => action(...args)).then(() => {
    process.stdout.write(`Finished '${taskName}' after ${new Date().getTime() - start.getTime()}ms\n`);
  }, err => process.stderr.write(`${err.stack}\n`));
}

process.nextTick(() => require.main.exports());
module.exports = (task, action) => run.bind(undefined, task, action);
