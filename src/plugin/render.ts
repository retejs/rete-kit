import replace from 'replace-in-file'

export async function renderTemplates(folder: string, locals: Record<string, string>) {
    const keys = Object.keys(locals)
    const from = keys.map(key => new RegExp('{{'+key+'}}', 'g'))
    const to = keys.map(key => locals[key])

    replace.sync({
        files: `${folder}/**/*`,
        from,
        to
    })
}
