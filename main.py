import functions_framework

@functions_framework.http
def cors_enabled_function(request):
    # For more information about CORS and CORS preflight requests, see:
    # https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('test', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    from github import Github

    # First create a Github instance:
    import os
    GIT_TOKEN = os.environ["GIT_TOKEN"]

    # using an access token
    g = Github(GIT_TOKEN)

    d = request.get_json()
    title = str(d["title"])
    file_content = str(d["gpt_text"])
    repo_name = str(d["repo_name"])
    if title.endswith("."):
        title = title
    else:
        title = title+"."
    # Then play with your Github objects:
    for repo in g.get_user().get_repos():
        if repo.name == repo_name:
            try:
                repo.create_file(title+"py", "init commit", file_content)
            except:
                error_message = {'message':f'issue with {title} or file already exists'}
                return (error_message,200,headers)

    return (d, 200, headers)
