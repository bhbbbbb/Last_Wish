// git log --pretty="%%aI%%s" --author="NAME" --no-merges --reverse > gitlog.log
// and send with postman

const fs = require('fs');

let log = fs.readFileSync('./gitlog.log').toString();

let output = [];

log.split('\n').forEach((str) => {
	if (!str) return;
	let date = str.substring(0, 25);
	let title = str.substring(25, str.length);

	output.push({
		title,
		estDate: date,
		body: "",
		finished: true,
	});
});

let obj = {
	article_content: {
		title: 'Git Commit History',
		body: 'Git commit history test',
		tags: ["#git"],
		milestones: output,
	}
}

fs.writeFileSync('output.json', JSON.stringify(obj));