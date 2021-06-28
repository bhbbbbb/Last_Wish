module.exports = async function updateFuzzy(Model, attrs) {
    for await (const doc of Model.find()) {
        if (attrs && attrs.length) {
            // eslint-disable-next-line no-loop-func
            const obj = attrs.reduce((acc, attr) => ({ ...acc, [attr]: doc[attr] }), {})
            await Model.findByIdAndUpdate(doc._id, obj) // No need to exec here, because of await
        }
    }
}