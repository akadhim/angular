import { AsyncRoute, AuxRoute, Route, Redirect } from './route_config_decorator';
import { isType } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
/**
 * Given a JS Object that represents a route config, returns a corresponding Route, AsyncRoute,
 * AuxRoute or Redirect object.
 *
 * Also wraps an AsyncRoute's loader function to add the loaded component's route config to the
 * `RouteRegistry`.
 */
export function normalizeRouteConfig(config, registry) {
    if (config instanceof AsyncRoute) {
        var wrappedLoader = wrapLoaderToReconfigureRegistry(config.loader, registry);
        return new AsyncRoute({
            path: config.path,
            loader: wrappedLoader,
            name: config.name,
            data: config.data,
            useAsDefault: config.useAsDefault
        });
    }
    if (config instanceof Route || config instanceof Redirect || config instanceof AuxRoute) {
        return config;
    }
    if ((+!!config.component) + (+!!config.redirectTo) + (+!!config.loader) != 1) {
        throw new BaseException(`Route config should contain exactly one "component", "loader", or "redirectTo" property.`);
    }
    if (config.as && config.name) {
        throw new BaseException(`Route config should contain exactly one "as" or "name" property.`);
    }
    if (config.as) {
        config.name = config.as;
    }
    if (config.loader) {
        var wrappedLoader = wrapLoaderToReconfigureRegistry(config.loader, registry);
        return new AsyncRoute({
            path: config.path,
            loader: wrappedLoader,
            name: config.name,
            data: config.data,
            useAsDefault: config.useAsDefault
        });
    }
    if (config.aux) {
        return new AuxRoute({ path: config.aux, component: config.component, name: config.name });
    }
    if (config.component) {
        if (typeof config.component == 'object') {
            let componentDefinitionObject = config.component;
            if (componentDefinitionObject.type == 'constructor') {
                return new Route({
                    path: config.path,
                    component: componentDefinitionObject.constructor,
                    name: config.name,
                    data: config.data,
                    useAsDefault: config.useAsDefault
                });
            }
            else if (componentDefinitionObject.type == 'loader') {
                return new AsyncRoute({
                    path: config.path,
                    loader: componentDefinitionObject.loader,
                    name: config.name,
                    data: config.data,
                    useAsDefault: config.useAsDefault
                });
            }
            else {
                throw new BaseException(`Invalid component type "${componentDefinitionObject.type}". Valid types are "constructor" and "loader".`);
            }
        }
        return new Route(config);
    }
    if (config.redirectTo) {
        return new Redirect({ path: config.path, redirectTo: config.redirectTo });
    }
    return config;
}
function wrapLoaderToReconfigureRegistry(loader, registry) {
    return () => {
        return loader().then((componentType) => {
            registry.configFromComponent(componentType);
            return componentType;
        });
    };
}
export function assertComponentExists(component, path) {
    if (!isType(component)) {
        throw new BaseException(`Component for route "${path}" is not defined, or is not a class.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVfY29uZmlnX25vcm1hbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVYyWHpkelBoLnRtcC9hbmd1bGFyMi9zcmMvcm91dGVyL3JvdXRlX2NvbmZpZy9yb3V0ZV9jb25maWdfbm9ybWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBa0IsTUFBTSwwQkFBMEI7T0FFeEYsRUFBQyxNQUFNLEVBQU8sTUFBTSwwQkFBMEI7T0FDOUMsRUFBQyxhQUFhLEVBQW1CLE1BQU0sZ0NBQWdDO0FBSTlFOzs7Ozs7R0FNRztBQUNILHFDQUFxQyxNQUF1QixFQUN2QixRQUF1QjtJQUMxRCxFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVksVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLGFBQWEsR0FBRywrQkFBK0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQztZQUNwQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDakIsTUFBTSxFQUFFLGFBQWE7WUFDckIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixZQUFZLEVBQUUsTUFBTSxDQUFDLFlBQVk7U0FDbEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSxLQUFLLElBQUksTUFBTSxZQUFZLFFBQVEsSUFBSSxNQUFNLFlBQVksUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN4RixNQUFNLENBQWtCLE1BQU0sQ0FBQztJQUNqQyxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcs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O0lBQ1osQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBR0QseUNBQXlDLE1BQWdCLEVBQUUsUUFBdUI7SUFFaEYsTUFBTSxDQUFDO1FBQ0wsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWE7WUFDakMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxhQUFhLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsc0NBQXNDLFNBQWUsRUFBRSxJQUFZO0lBQ2pFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLElBQUksYUFBYSxDQUFDLHdCQUF3QixJQUFJLHNDQUFzQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FzeW5jUm91dGUsIEF1eFJvdXRlLCBSb3V0ZSwgUmVkaXJlY3QsIFJvdXRlRGVmaW5pdGlvbn0gZnJvbSAnLi9yb3V0ZV9jb25maWdfZGVjb3JhdG9yJztcbmltcG9ydCB7Q29tcG9uZW50RGVmaW5pdGlvbn0gZnJvbSAnLi4vcm91dGVfZGVmaW5pdGlvbic7XG5pbXBvcnQge2lzVHlwZSwgVHlwZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7Um91dGVSZWdpc3RyeX0gZnJvbSAnLi4vcm91dGVfcmVnaXN0cnknO1xuXG5cbi8qKlxuICogR2l2ZW4gYSBKUyBPYmplY3QgdGhhdCByZXByZXNlbnRzIGEgcm91dGUgY29uZmlnLCByZXR1cm5zIGEgY29ycmVzcG9uZGluZyBSb3V0ZSwgQXN5bmNSb3V0ZSxcbiAqIEF1eFJvdXRlIG9yIFJlZGlyZWN0IG9iamVjdC5cbiAqXG4gKiBBbHNvIHdyYXBzIGFuIEFzeW5jUm91dGUncyBsb2FkZXIgZnVuY3Rpb24gdG8gYWRkIHRoZSBsb2FkZWQgY29tcG9uZW50J3Mgcm91dGUgY29uZmlnIHRvIHRoZVxuICogYFJvdXRlUmVnaXN0cnlgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplUm91dGVDb25maWcoY29uZmlnOiBSb3V0ZURlZmluaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnaXN0cnk6IFJvdXRlUmVnaXN0cnkpOiBSb3V0ZURlZmluaXRpb24ge1xuICBpZiAoY29uZmlnIGluc3RhbmNlb2YgQXN5bmNSb3V0ZSkge1xuICAgIHZhciB3cmFwcGVkTG9hZGVyID0gd3JhcExvYWRlclRvUmVjb25maWd1cmVSZWdpc3RyeShjb25maWcubG9hZGVyLCByZWdpc3RyeSk7XG4gICAgcmV0dXJuIG5ldyBBc3luY1JvdXRlKHtcbiAgICAgIHBhdGg6IGNvbmZpZy5wYXRoLFxuICAgICAgbG9hZGVyOiB3cmFwcGVkTG9hZGVyLFxuICAgICAgbmFtZTogY29uZmlnLm5hbWUsXG4gICAgICBkYXRhOiBjb25maWcuZGF0YSxcbiAgICAgIHVzZUFzRGVmYXVsdDogY29uZmlnLnVzZUFzRGVmYXVsdFxuICAgIH0pO1xuICB9XG4gIGlmIChjb25maWcgaW5zdGFuY2VvZiBSb3V0ZSB8fCBjb25maWcgaW5zdGFuY2VvZiBSZWRpcmVjdCB8fCBjb25maWcgaW5zdGFuY2VvZiBBdXhSb3V0ZSkge1xuICAgIHJldHVybiA8Um91dGVEZWZpbml0aW9uPmNvbmZpZztcbiAgfVxuXG4gIGlmICgoKyEhY29uZmlnLmNvbXBvbmVudCkgKyAoKyEhY29uZmlnLnJlZGlyZWN0VG8pICsgKCshIWNvbmZpZy5sb2FkZXIpICE9IDEpIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgYFJvdXRlIGNvbmZpZyBzaG91bGQgY29udGFpbiBleGFjdGx5IG9uZSBcImNvbXBvbmVudFwiLCBcImxvYWRlclwiLCBvciBcInJlZGlyZWN0VG9cIiBwcm9wZXJ0eS5gKTtcbiAgfVxuICBpZiAoY29uZmlnLmFzICYmIGNvbmZpZy5uYW1lKSB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYFJvdXRlIGNvbmZpZyBzaG91bGQgY29udGFpbiBleGFjdGx5IG9uZSBcImFzXCIgb3IgXCJuYW1lXCIgcHJvcGVydHkuYCk7XG4gIH1cbiAgaWYgKGNvbmZpZy5hcykge1xuICAgIGNvbmZpZy5uYW1lID0gY29uZmlnLmFzO1xuICB9XG4gIGlmIChjb25maWcubG9hZGVyKSB7XG4gICAgdmFyIHdyYXBwZWRMb2FkZXIgPSB3cmFwTG9hZGVyVG9SZWNvbmZpZ3VyZVJlZ2lzdHJ5KGNvbmZpZy5sb2FkZXIsIHJlZ2lzdHJ5KTtcbiAgICByZXR1cm4gbmV3IEFzeW5jUm91dGUoe1xuICAgICAgcGF0aDogY29uZmlnLnBhdGgsXG4gICAgICBsb2FkZXI6IHdyYXBwZWRMb2FkZXIsXG4gICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgIGRhdGE6IGNvbmZpZy5kYXRhLFxuICAgICAgdXNlQXNEZWZhdWx0OiBjb25maWcudXNlQXNEZWZhdWx0XG4gICAgfSk7XG4gIH1cbiAgaWYgKGNvbmZpZy5hdXgpIHtcbiAgICByZXR1cm4gbmV3IEF1eFJvdXRlKHtwYXRoOiBjb25maWcuYXV4LCBjb21wb25lbnQ6PFR5cGU+Y29uZmlnLmNvbXBvbmVudCwgbmFtZTogY29uZmlnLm5hbWV9KTtcbiAgfVxuICBpZiAoY29uZmlnLmNvbXBvbmVudCkge1xuICAgIGlmICh0eXBlb2YgY29uZmlnLmNvbXBvbmVudCA9PSAnb2JqZWN0Jykge1xuICAgICAgbGV0IGNvbXBvbmVudERlZmluaXRpb25PYmplY3QgPSA8Q29tcG9uZW50RGVmaW5pdGlvbj5jb25maWcuY29tcG9uZW50O1xuICAgICAgaWYgKGNvbXBvbmVudERlZmluaXRpb25PYmplY3QudHlwZSA9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgIHJldHVybiBuZXcgUm91dGUoe1xuICAgICAgICAgIHBhdGg6IGNvbmZpZy5wYXRoLFxuICAgICAgICAgIGNvbXBvbmVudDo8VHlwZT5jb21wb25lbnREZWZpbml0aW9uT2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICAgIG5hbWU6IGNvbmZpZy5uYW1lLFxuICAgICAgICAgIGRhdGE6IGNvbmZpZy5kYXRhLFxuICAgICAgICAgIHVzZUFzRGVmYXVsdDogY29uZmlnLnVzZUFzRGVmYXVsdFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50RGVmaW5pdGlvbk9iamVjdC50eXBlID09ICdsb2FkZXInKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXN5bmNSb3V0ZSh7XG4gICAgICAgICAgcGF0aDogY29uZmlnLnBhdGgsXG4gICAgICAgICAgbG9hZGVyOiBjb21wb25lbnREZWZpbml0aW9uT2JqZWN0LmxvYWRlcixcbiAgICAgICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgICAgICBkYXRhOiBjb25maWcuZGF0YSxcbiAgICAgICAgICB1c2VBc0RlZmF1bHQ6IGNvbmZpZy51c2VBc0RlZmF1bHRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICAgIGBJbnZhbGlkIGNvbXBvbmVudCB0eXBlIFwiJHtjb21wb25lbnREZWZpbml0aW9uT2JqZWN0LnR5cGV9XCIuIFZhbGlkIHR5cGVzIGFyZSBcImNvbnN0cnVjdG9yXCIgYW5kIFwibG9hZGVyXCIuYCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgUm91dGUoPHtcbiAgICAgIHBhdGg6IHN0cmluZztcbiAgICAgIGNvbXBvbmVudDogVHlwZTtcbiAgICAgIG5hbWU/OiBzdHJpbmc7XG4gICAgICBkYXRhPzoge1trZXk6IHN0cmluZ106IGFueX07XG4gICAgICB1c2VBc0RlZmF1bHQ/OiBib29sZWFuO1xuICAgIH0+Y29uZmlnKTtcbiAgfVxuXG4gIGlmIChjb25maWcucmVkaXJlY3RUbykge1xuICAgIHJldHVybiBuZXcgUmVkaXJlY3Qoe3BhdGg6IGNvbmZpZy5wYXRoLCByZWRpcmVjdFRvOiBjb25maWcucmVkaXJlY3RUb30pO1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuXG5mdW5jdGlvbiB3cmFwTG9hZGVyVG9SZWNvbmZpZ3VyZVJlZ2lzdHJ5KGxvYWRlcjogRnVuY3Rpb24sIHJlZ2lzdHJ5OiBSb3V0ZVJlZ2lzdHJ5KTogKCkgPT5cbiAgICBQcm9taXNlPFR5cGU+IHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICByZXR1cm4gbG9hZGVyKCkudGhlbigoY29tcG9uZW50VHlwZSkgPT4ge1xuICAgICAgcmVnaXN0cnkuY29uZmlnRnJvbUNvbXBvbmVudChjb21wb25lbnRUeXBlKTtcbiAgICAgIHJldHVybiBjb21wb25lbnRUeXBlO1xuICAgIH0pO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Q29tcG9uZW50RXhpc3RzKGNvbXBvbmVudDogVHlwZSwgcGF0aDogc3RyaW5nKTogdm9pZCB7XG4gIGlmICghaXNUeXBlKGNvbXBvbmVudCkpIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgQ29tcG9uZW50IGZvciByb3V0ZSBcIiR7cGF0aH1cIiBpcyBub3QgZGVmaW5lZCwgb3IgaXMgbm90IGEgY2xhc3MuYCk7XG4gIH1cbn1cbiJdfQ==