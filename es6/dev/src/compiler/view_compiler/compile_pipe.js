import { isBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import * as o from '../output/output_ast';
import { Identifiers, identifierToken } from '../identifiers';
import { injectFromViewParentInjector, createPureProxy, getPropertyInView } from './util';
class _PurePipeProxy {
    constructor(instance, argCount) {
        this.instance = instance;
        this.argCount = argCount;
    }
}
export class CompilePipe {
    constructor(view, name) {
        this.view = view;
        this._purePipeProxies = [];
        this.meta = _findPipeMeta(view, name);
        this.instance = o.THIS_EXPR.prop(`_pipe_${name}_${view.pipeCount++}`);
    }
    get pure() { return this.meta.pure; }
    create() {
        var deps = this.meta.type.diDeps.map((diDep) => {
            if (diDep.token.equalsTo(identifierToken(Identifiers.ChangeDetectorRef))) {
                return getPropertyInView(o.THIS_EXPR.prop('ref'), this.view, this.view.componentView);
            }
            return injectFromViewParentInjector(diDep.token, false);
        });
        this.view.fields.push(new o.ClassField(this.instance.name, o.importType(this.meta.type)));
        this.view.createMethod.resetDebugInfo(null, null);
        this.view.createMethod.addStmt(o.THIS_EXPR.prop(this.instance.name)
            .set(o.importExpr(this.meta.type).instantiate(deps))
            .toStmt());
        this._purePipeProxies.forEach((purePipeProxy) => {
            createPureProxy(this.instance.prop('transform').callMethod(o.BuiltinMethod.bind, [this.instance]), purePipeProxy.argCount, purePipeProxy.instance, this.view);
        });
    }
    call(callingView, args) {
        if (this.meta.pure) {
            var purePipeProxy = new _PurePipeProxy(o.THIS_EXPR.prop(`${this.instance.name}_${this._purePipeProxies.length}`), args.length);
            this._purePipeProxies.push(purePipeProxy);
            return getPropertyInView(o.importExpr(Identifiers.castByValue)
                .callFn([purePipeProxy.instance, this.instance.prop('transform')]), callingView, this.view)
                .callFn(args);
        }
        else {
            return getPropertyInView(this.instance, callingView, this.view).callMethod('transform', args);
        }
    }
}
function _findPipeMeta(view, name) {
    var pipeMeta = null;
    for (var i = view.pipeMetas.length - 1; i >= 0; i--) {
        var localPipeMeta = view.pipeMetas[i];
        if (localPipeMeta.name == name) {
            pipeMeta = localPipeMeta;
            break;
        }
    }
    if (isBlank(pipeMeta)) {
        throw new BaseException(`Illegal state: Could not find pipe ${name} although the parser should have detected this error!`);
    }
    return pipeMeta;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1WMlh6ZHpQaC50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIvY29tcGlsZV9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsT0FBTyxFQUFZLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BQ3JELEtBQUssQ0FBQyxNQUFNLHNCQUFzQjtPQUdsQyxFQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUMsTUFBTSxnQkFBZ0I7T0FDcEQsRUFBQyw0QkFBNEIsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxRQUFRO0FBRXZGO0lBQ0UsWUFBbUIsUUFBd0IsRUFBUyxRQUFnQjtRQUFqRCxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVE7SUFBRyxDQUFDO0FBQzFFLENBQUM7QUFFRDtJQUtFLFlBQW1CLElBQWlCLEVBQUUsSUFBWTtRQUEvQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBRjVCLHFCQUFnQixHQUFxQixFQUFFLENBQUM7UUFHOUMsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsSUFBSSxJQUFJLEtBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUU5QyxNQUFNO1FBQ0osSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcs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Q0gsQ0FBQztBQUdELHVCQUF1QixJQUFpQixFQUFFLElBQVk7SUFDcEQsSUFBSSxRQUFRLEdBQXdCLElBQUksQ0FBQztJQUN6QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3BELElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQy9CLFFBQVEsR0FBRyxhQUFhLENBQUM7WUFDekIsS0FBSyxDQUFDO1FBQ1IsQ0FBQztJQUNILENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxhQUFhLENBQ25CLHNDQUFzQyxJQUFJLHVEQUF1RCxDQUFDLENBQUM7SUFDekcsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNCbGFuaywgaXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge0NvbXBpbGVWaWV3fSBmcm9tICcuL2NvbXBpbGVfdmlldyc7XG5pbXBvcnQge0NvbXBpbGVQaXBlTWV0YWRhdGF9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtJZGVudGlmaWVycywgaWRlbnRpZmllclRva2VufSBmcm9tICcuLi9pZGVudGlmaWVycyc7XG5pbXBvcnQge2luamVjdEZyb21WaWV3UGFyZW50SW5qZWN0b3IsIGNyZWF0ZVB1cmVQcm94eSwgZ2V0UHJvcGVydHlJblZpZXd9IGZyb20gJy4vdXRpbCc7XG5cbmNsYXNzIF9QdXJlUGlwZVByb3h5IHtcbiAgY29uc3RydWN0b3IocHVibGljIGluc3RhbmNlOiBvLlJlYWRQcm9wRXhwciwgcHVibGljIGFyZ0NvdW50OiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21waWxlUGlwZSB7XG4gIG1ldGE6IENvbXBpbGVQaXBlTWV0YWRhdGE7XG4gIGluc3RhbmNlOiBvLlJlYWRQcm9wRXhwcjtcbiAgcHJpdmF0ZSBfcHVyZVBpcGVQcm94aWVzOiBfUHVyZVBpcGVQcm94eVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIHZpZXc6IENvbXBpbGVWaWV3LCBuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1ldGEgPSBfZmluZFBpcGVNZXRhKHZpZXcsIG5hbWUpO1xuICAgIHRoaXMuaW5zdGFuY2UgPSBvLlRISVNfRVhQUi5wcm9wKGBfcGlwZV8ke25hbWV9XyR7dmlldy5waXBlQ291bnQrK31gKTtcbiAgfVxuXG4gIGdldCBwdXJlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5tZXRhLnB1cmU7IH1cblxuICBjcmVhdGUoKTogdm9pZCB7XG4gICAgdmFyIGRlcHMgPSB0aGlzLm1ldGEudHlwZS5kaURlcHMubWFwKChkaURlcCkgPT4ge1xuICAgICAgaWYgKGRpRGVwLnRva2VuLmVxdWFsc1RvKGlkZW50aWZpZXJUb2tlbihJZGVudGlmaWVycy5DaGFuZ2VEZXRlY3RvclJlZikpKSB7XG4gICAgICAgIHJldHVybiBnZXRQcm9wZXJ0eUluVmlldyhvLlRISVNfRVhQUi5wcm9wKCdyZWYnKSwgdGhpcy52aWV3LCB0aGlzLnZpZXcuY29tcG9uZW50Vmlldyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5qZWN0RnJvbVZpZXdQYXJlbnRJbmplY3RvcihkaURlcC50b2tlbiwgZmFsc2UpO1xuICAgIH0pO1xuICAgIHRoaXMudmlldy5maWVsZHMucHVzaChuZXcgby5DbGFzc0ZpZWxkKHRoaXMuaW5zdGFuY2UubmFtZSwgby5pbXBvcnRUeXBlKHRoaXMubWV0YS50eXBlKSkpO1xuICAgIHRoaXMudmlldy5jcmVhdGVNZXRob2QucmVzZXREZWJ1Z0luZm8obnVsbCwgbnVsbCk7XG4gICAgdGhpcy52aWV3LmNyZWF0ZU1ldGhvZC5hZGRTdG10KG8uVEhJU19FWFBSLnByb3AodGhpcy5pbnN0YW5jZS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChvLmltcG9ydEV4cHIodGhpcy5tZXRhLnR5cGUpLmluc3RhbnRpYXRlKGRlcHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RtdCgpKTtcbiAgICB0aGlzLl9wdXJlUGlwZVByb3hpZXMuZm9yRWFjaCgocHVyZVBpcGVQcm94eSkgPT4ge1xuICAgICAgY3JlYXRlUHVyZVByb3h5KFxuICAgICAgICAgIHRoaXMuaW5zdGFuY2UucHJvcCgndHJhbnNmb3JtJykuY2FsbE1ldGhvZChvLkJ1aWx0aW5NZXRob2QuYmluZCwgW3RoaXMuaW5zdGFuY2VdKSxcbiAgICAgICAgICBwdXJlUGlwZVByb3h5LmFyZ0NvdW50LCBwdXJlUGlwZVByb3h5Lmluc3RhbmNlLCB0aGlzLnZpZXcpO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsbChjYWxsaW5nVmlldzogQ29tcGlsZVZpZXcsIGFyZ3M6IG8uRXhwcmVzc2lvbltdKTogby5FeHByZXNzaW9uIHtcbiAgICBpZiAodGhpcy5tZXRhLnB1cmUpIHtcbiAgICAgIHZhciBwdXJlUGlwZVByb3h5ID0gbmV3IF9QdXJlUGlwZVByb3h5KFxuICAgICAgICAgIG8uVEhJU19FWFBSLnByb3AoYCR7dGhpcy5pbnN0YW5jZS5uYW1lfV8ke3RoaXMuX3B1cmVQaXBlUHJveGllcy5sZW5ndGh9YCksIGFyZ3MubGVuZ3RoKTtcbiAgICAgIHRoaXMuX3B1cmVQaXBlUHJveGllcy5wdXNoKHB1cmVQaXBlUHJveHkpO1xuICAgICAgcmV0dXJuIGdldFByb3BlcnR5SW5WaWV3KFxuICAgICAgICAgICAgICAgICBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuY2FzdEJ5VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAuY2FsbEZuKFtwdXJlUGlwZVByb3h5Lmluc3RhbmNlLCB0aGlzLmluc3RhbmNlLnByb3AoJ3RyYW5zZm9ybScpXSksXG4gICAgICAgICAgICAgICAgIGNhbGxpbmdWaWV3LCB0aGlzLnZpZXcpXG4gICAgICAgICAgLmNhbGxGbihhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdldFByb3BlcnR5SW5WaWV3KHRoaXMuaW5zdGFuY2UsIGNhbGxpbmdWaWV3LCB0aGlzLnZpZXcpLmNhbGxNZXRob2QoJ3RyYW5zZm9ybScsIGFyZ3MpO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIF9maW5kUGlwZU1ldGEodmlldzogQ29tcGlsZVZpZXcsIG5hbWU6IHN0cmluZyk6IENvbXBpbGVQaXBlTWV0YWRhdGEge1xuICB2YXIgcGlwZU1ldGE6IENvbXBpbGVQaXBlTWV0YWRhdGEgPSBudWxsO1xuICBmb3IgKHZhciBpID0gdmlldy5waXBlTWV0YXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbG9jYWxQaXBlTWV0YSA9IHZpZXcucGlwZU1ldGFzW2ldO1xuICAgIGlmIChsb2NhbFBpcGVNZXRhLm5hbWUgPT0gbmFtZSkge1xuICAgICAgcGlwZU1ldGEgPSBsb2NhbFBpcGVNZXRhO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChpc0JsYW5rKHBpcGVNZXRhKSkge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICBgSWxsZWdhbCBzdGF0ZTogQ291bGQgbm90IGZpbmQgcGlwZSAke25hbWV9IGFsdGhvdWdoIHRoZSBwYXJzZXIgc2hvdWxkIGhhdmUgZGV0ZWN0ZWQgdGhpcyBlcnJvciFgKTtcbiAgfVxuICByZXR1cm4gcGlwZU1ldGE7XG59XG4iXX0=