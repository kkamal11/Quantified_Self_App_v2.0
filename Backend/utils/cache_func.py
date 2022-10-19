from Cache.cache import cache

@cache.memoize(86400)
def get_user(user):
    return user

@cache.memoize(5)
def get_trackers(user):
    if user:
        return user.trackers

@cache.memoize(86400)
def chatlink(user):
    L = user.chatlink
    if len(L) != 0:
        return user.chatlink[-1]
    return None
