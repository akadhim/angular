import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import * as o from '../output/output_ast';
import { Identifiers } from '../identifiers';
export function getPropertyInView(property, callingView, definedView) {
    if (callingView === definedView) {
        return property;
    }
    else {
        var viewProp = o.THIS_EXPR;
        var currView = callingView;
        while (currView !== definedView && isPresent(currView.declarationElement.view)) {
            currView = currView.declarationElement.view;
            viewProp = viewProp.prop('parent');
        }
        if (currView !== definedView) {
            throw new BaseException(`Internal error: Could not calculate a property in a parent view: ${property}`);
        }
        if (property instanceof o.ReadPropExpr) {
            let readPropExpr = property;
            // Note: Don't cast for members of the AppView base class...
            if (definedView.fields.some((field) => field.name == readPropExpr.name) ||
                definedView.getters.some((field) => field.name == readPropExpr.name)) {
                viewProp = viewProp.cast(definedView.classType);
            }
        }
        return o.replaceVarInExpression(o.THIS_EXPR.name, viewProp, property);
    }
}
export function injectFromViewParentInjector(token, optional) {
    var args = [createDiTokenExpression(token)];
    if (optional) {
        args.push(o.NULL_EXPR);
    }
    return o.THIS_EXPR.prop('parentInjector').callMethod('get', args);
}
export function getViewFactoryName(component, embeddedTemplateIndex) {
    return `viewFactory_${component.type.name}${embeddedTemplateIndex}`;
}
export function createDiTokenExpression(token) {
    if (isPresent(token.value)) {
        return o.literal(token.value);
    }
    else if (token.identifierIsInstance) {
        return o.importExpr(token.identifier)
            .instantiate([], o.importType(token.identifier, [], [o.TypeModifier.Const]));
    }
    else {
        return o.importExpr(token.identifier);
    }
}
export function createFlatArray(expressions) {
    var lastNonArrayExpressions = [];
    var result = o.literalArr([]);
    for (var i = 0; i < expressions.length; i++) {
        var expr = expressions[i];
        if (expr.type instanceof o.ArrayType) {
            if (lastNonArrayExpressions.length > 0) {
                result =
                    result.callMethod(o.BuiltinMethod.ConcatArray, [o.literalArr(lastNonArrayExpressions)]);
                lastNonArrayExpressions = [];
            }
            result = result.callMethod(o.BuiltinMethod.ConcatArray, [expr]);
        }
        else {
            lastNonArrayExpressions.push(expr);
        }
    }
    if (lastNonArrayExpressions.length > 0) {
        result =
            result.callMethod(o.BuiltinMethod.ConcatArray, [o.literalArr(lastNonArrayExpressions)]);
    }
    return result;
}
export function createPureProxy(fn, argCount, pureProxyProp, view) {
    view.fields.push(new o.ClassField(pureProxyProp.name, null));
    var pureProxyId = argCount < Identifiers.pureProxies.length ? Identifiers.pureProxies[argCount] : null;
    if (isBlank(pureProxyId)) {
        throw new BaseException(`Unsupported number of argument for pure functions: ${argCount}`);
    }
    view.createMethod.addStmt(o.THIS_EXPR.prop(pureProxyProp.name).set(o.importExpr(pureProxyId).callFn([fn])).toStmt());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtVjJYemR6UGgudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BRXJELEtBQUssQ0FBQyxNQUFNLHNCQUFzQjtPQU9sQyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQjtBQUUxQyxrQ0FBa0MsUUFBc0IsRUFBRSxXQUF3QixFQUNoRCxXQUF3QjtJQUN4RCxFQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksUUFBUSxHQUFpQixDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3pDLElBQUksUUFBUSxHQUFnQixXQUFXLENBQUM7UUFDeEMsT0FBTyxRQUFRLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMvRSxRQUFRLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQztZQUM1QyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxJQUFJLGFBQWEsQ0FDbkIsb0VBQW9FLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLFlBQVksR0FBbUIsUUFBUSxDQUFDO1lBQzVDLDREQUE0RDtZQUM1RCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsSUFBSSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUM7Z0JBQ25FLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekUsUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEUsQ0FBQztBQUNILENBQUM7QUFFRCw2Q0FBNkMsS0FBMkIsRUFDM0IsUUFBaUI7SUFDNUQsSUFBSSxJQUFJLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzVDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBRUQsbUNBQW1DLFNBQW1DLEVBQ25DLHFCQUE2QjtJQUM5RCxNQUFNLENBQUMsZUFBZSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBcUIsRUFBRSxDQUFDO0FBQ3RFLENBQUM7QUFHRCx3Q0FBd0MsS0FBMkI7SUFDakUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO2FBQ2hDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxDQUFDO0FBQ0gsQ0FBQztBQUVELGdDQUFnQyxXQUEyQjtJQUN6RCxJQUFJLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztJQUNqQyxJQUFJLE1BQU0sR0FBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTTtvQkFDRixNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUYsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1lBQy9CLENBQUM7WUFDRCxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDSCxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTTtZQUNGLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlGLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxnQ0FBZ0MsRUFBZ0IsRUFBRSxRQUFnQixFQUFFLGFBQTZCLEVBQ2pFLElBQWlCO0lBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0QsSUFBSSxXQUFXLEdBQ1gsUUFBUSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3pGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsTUFBTSxJQUFJLGFBQWEsQ0FBQyxzREFBc0QsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQ3JCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNqRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5cbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtcbiAgQ29tcGlsZVRva2VuTWV0YWRhdGEsXG4gIENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVxufSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7Q29tcGlsZVZpZXd9IGZyb20gJy4vY29tcGlsZV92aWV3JztcbmltcG9ydCB7SWRlbnRpZmllcnN9IGZyb20gJy4uL2lkZW50aWZpZXJzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3BlcnR5SW5WaWV3KHByb3BlcnR5OiBvLkV4cHJlc3Npb24sIGNhbGxpbmdWaWV3OiBDb21waWxlVmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZpbmVkVmlldzogQ29tcGlsZVZpZXcpOiBvLkV4cHJlc3Npb24ge1xuICBpZiAoY2FsbGluZ1ZpZXcgPT09IGRlZmluZWRWaWV3KSB7XG4gICAgcmV0dXJuIHByb3BlcnR5O1xuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3UHJvcDogby5FeHByZXNzaW9uID0gby5USElTX0VYUFI7XG4gICAgdmFyIGN1cnJWaWV3OiBDb21waWxlVmlldyA9IGNhbGxpbmdWaWV3O1xuICAgIHdoaWxlIChjdXJyVmlldyAhPT0gZGVmaW5lZFZpZXcgJiYgaXNQcmVzZW50KGN1cnJWaWV3LmRlY2xhcmF0aW9uRWxlbWVudC52aWV3KSkge1xuICAgICAgY3VyclZpZXcgPSBjdXJyVmlldy5kZWNsYXJhdGlvbkVsZW1lbnQudmlldztcbiAgICAgIHZpZXdQcm9wID0gdmlld1Byb3AucHJvcCgncGFyZW50Jyk7XG4gICAgfVxuICAgIGlmIChjdXJyVmlldyAhPT0gZGVmaW5lZFZpZXcpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgIGBJbnRlcm5hbCBlcnJvcjogQ291bGQgbm90IGNhbGN1bGF0ZSBhIHByb3BlcnR5IGluIGEgcGFyZW50IHZpZXc6ICR7cHJvcGVydHl9YCk7XG4gICAgfVxuICAgIGlmIChwcm9wZXJ0eSBpbnN0YW5jZW9mIG8uUmVhZFByb3BFeHByKSB7XG4gICAgICBsZXQgcmVhZFByb3BFeHByOiBvLlJlYWRQcm9wRXhwciA9IHByb3BlcnR5O1xuICAgICAgLy8gTm90ZTogRG9uJ3QgY2FzdCBmb3IgbWVtYmVycyBvZiB0aGUgQXBwVmlldyBiYXNlIGNsYXNzLi4uXG4gICAgICBpZiAoZGVmaW5lZFZpZXcuZmllbGRzLnNvbWUoKGZpZWxkKSA9PiBmaWVsZC5uYW1lID09IHJlYWRQcm9wRXhwci5uYW1lKSB8fFxuICAgICAgICAgIGRlZmluZWRWaWV3LmdldHRlcnMuc29tZSgoZmllbGQpID0+IGZpZWxkLm5hbWUgPT0gcmVhZFByb3BFeHByLm5hbWUpKSB7XG4gICAgICAgIHZpZXdQcm9wID0gdmlld1Byb3AuY2FzdChkZWZpbmVkVmlldy5jbGFzc1R5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gby5yZXBsYWNlVmFySW5FeHByZXNzaW9uKG8uVEhJU19FWFBSLm5hbWUsIHZpZXdQcm9wLCBwcm9wZXJ0eSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEZyb21WaWV3UGFyZW50SW5qZWN0b3IodG9rZW46IENvbXBpbGVUb2tlbk1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uYWw6IGJvb2xlYW4pOiBvLkV4cHJlc3Npb24ge1xuICB2YXIgYXJncyA9IFtjcmVhdGVEaVRva2VuRXhwcmVzc2lvbih0b2tlbildO1xuICBpZiAob3B0aW9uYWwpIHtcbiAgICBhcmdzLnB1c2goby5OVUxMX0VYUFIpO1xuICB9XG4gIHJldHVybiBvLlRISVNfRVhQUi5wcm9wKCdwYXJlbnRJbmplY3RvcicpLmNhbGxNZXRob2QoJ2dldCcsIGFyZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Vmlld0ZhY3RvcnlOYW1lKGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWJlZGRlZFRlbXBsYXRlSW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBgdmlld0ZhY3RvcnlfJHtjb21wb25lbnQudHlwZS5uYW1lfSR7ZW1iZWRkZWRUZW1wbGF0ZUluZGV4fWA7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURpVG9rZW5FeHByZXNzaW9uKHRva2VuOiBDb21waWxlVG9rZW5NZXRhZGF0YSk6IG8uRXhwcmVzc2lvbiB7XG4gIGlmIChpc1ByZXNlbnQodG9rZW4udmFsdWUpKSB7XG4gICAgcmV0dXJuIG8ubGl0ZXJhbCh0b2tlbi52YWx1ZSk7XG4gIH0gZWxzZSBpZiAodG9rZW4uaWRlbnRpZmllcklzSW5zdGFuY2UpIHtcbiAgICByZXR1cm4gby5pbXBvcnRFeHByKHRva2VuLmlkZW50aWZpZXIpXG4gICAgICAgIC5pbnN0YW50aWF0ZShbXSwgby5pbXBvcnRUeXBlKHRva2VuLmlkZW50aWZpZXIsIFtdLCBbby5UeXBlTW9kaWZpZXIuQ29uc3RdKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG8uaW1wb3J0RXhwcih0b2tlbi5pZGVudGlmaWVyKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmxhdEFycmF5KGV4cHJlc3Npb25zOiBvLkV4cHJlc3Npb25bXSk6IG8uRXhwcmVzc2lvbiB7XG4gIHZhciBsYXN0Tm9uQXJyYXlFeHByZXNzaW9ucyA9IFtdO1xuICB2YXIgcmVzdWx0OiBvLkV4cHJlc3Npb24gPSBvLmxpdGVyYWxBcnIoW10pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cHJlc3Npb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGV4cHIgPSBleHByZXNzaW9uc1tpXTtcbiAgICBpZiAoZXhwci50eXBlIGluc3RhbmNlb2Ygby5BcnJheVR5cGUpIHtcbiAgICAgIGlmIChsYXN0Tm9uQXJyYXlFeHByZXNzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgICByZXN1bHQuY2FsbE1ldGhvZChvLkJ1aWx0aW5NZXRob2QuQ29uY2F0QXJyYXksIFtvLmxpdGVyYWxBcnIobGFzdE5vbkFycmF5RXhwcmVzc2lvbnMpXSk7XG4gICAgICAgIGxhc3ROb25BcnJheUV4cHJlc3Npb25zID0gW107XG4gICAgICB9XG4gICAgICByZXN1bHQgPSByZXN1bHQuY2FsbE1ldGhvZChvLkJ1aWx0aW5NZXRob2QuQ29uY2F0QXJyYXksIFtleHByXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhc3ROb25BcnJheUV4cHJlc3Npb25zLnB1c2goZXhwcik7XG4gICAgfVxuICB9XG4gIGlmIChsYXN0Tm9uQXJyYXlFeHByZXNzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgcmVzdWx0ID1cbiAgICAgICAgcmVzdWx0LmNhbGxNZXRob2Qoby5CdWlsdGluTWV0aG9kLkNvbmNhdEFycmF5LCBbby5saXRlcmFsQXJyKGxhc3ROb25BcnJheUV4cHJlc3Npb25zKV0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQdXJlUHJveHkoZm46IG8uRXhwcmVzc2lvbiwgYXJnQ291bnQ6IG51bWJlciwgcHVyZVByb3h5UHJvcDogby5SZWFkUHJvcEV4cHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXc6IENvbXBpbGVWaWV3KSB7XG4gIHZpZXcuZmllbGRzLnB1c2gobmV3IG8uQ2xhc3NGaWVsZChwdXJlUHJveHlQcm9wLm5hbWUsIG51bGwpKTtcbiAgdmFyIHB1cmVQcm94eUlkID1cbiAgICAgIGFyZ0NvdW50IDwgSWRlbnRpZmllcnMucHVyZVByb3hpZXMubGVuZ3RoID8gSWRlbnRpZmllcnMucHVyZVByb3hpZXNbYXJnQ291bnRdIDogbnVsbDtcbiAgaWYgKGlzQmxhbmsocHVyZVByb3h5SWQpKSB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYFVuc3VwcG9ydGVkIG51bWJlciBvZiBhcmd1bWVudCBmb3IgcHVyZSBmdW5jdGlvbnM6ICR7YXJnQ291bnR9YCk7XG4gIH1cbiAgdmlldy5jcmVhdGVNZXRob2QuYWRkU3RtdChcbiAgICAgIG8uVEhJU19FWFBSLnByb3AocHVyZVByb3h5UHJvcC5uYW1lKS5zZXQoby5pbXBvcnRFeHByKHB1cmVQcm94eUlkKS5jYWxsRm4oW2ZuXSkpLnRvU3RtdCgpKTtcbn1cbiJdfQ==