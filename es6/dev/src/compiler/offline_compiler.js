import { CompileIdentifierMetadata, createHostComponentMeta } from './compile_metadata';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper } from 'angular2/src/facade/collection';
import * as o from './output/output_ast';
import { ComponentFactory } from 'angular2/src/core/linker/component_factory';
import { MODULE_SUFFIX } from './util';
var _COMPONENT_FACTORY_IDENTIFIER = new CompileIdentifierMetadata({
    name: 'ComponentFactory',
    runtime: ComponentFactory,
    moduleUrl: `asset:angular2/lib/src/core/linker/component_factory${MODULE_SUFFIX}`
});
export class SourceModule {
    constructor(moduleUrl, source) {
        this.moduleUrl = moduleUrl;
        this.source = source;
    }
}
export class NormalizedComponentWithViewDirectives {
    constructor(component, directives, pipes) {
        this.component = component;
        this.directives = directives;
        this.pipes = pipes;
    }
}
export class OfflineCompiler {
    constructor(_directiveNormalizer, _templateParser, _styleCompiler, _viewCompiler, _outputEmitter) {
        this._directiveNormalizer = _directiveNormalizer;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._outputEmitter = _outputEmitter;
    }
    normalizeDirectiveMetadata(directive) {
        return this._directiveNormalizer.normalizeDirective(directive);
    }
    compileTemplates(components) {
        if (components.length === 0) {
            throw new BaseException('No components given');
        }
        var statements = [];
        var exportedVars = [];
        var moduleUrl = _templateModuleUrl(components[0].component);
        components.forEach(componentWithDirs => {
            var compMeta = componentWithDirs.component;
            _assertComponent(compMeta);
            var compViewFactoryVar = this._compileComponent(compMeta, componentWithDirs.directives, componentWithDirs.pipes, statements);
            exportedVars.push(compViewFactoryVar);
            var hostMeta = createHostComponentMeta(compMeta.type, compMeta.selector);
            var hostViewFactoryVar = this._compileComponent(hostMeta, [compMeta], [], statements);
            var compFactoryVar = `${compMeta.type.name}NgFactory`;
            statements.push(o.variable(compFactoryVar)
                .set(o.importExpr(_COMPONENT_FACTORY_IDENTIFIER, [o.importType(compMeta.type)])
                .instantiate([
                o.literal(compMeta.selector),
                o.variable(hostViewFactoryVar),
                o.importExpr(compMeta.type)
            ], o.importType(_COMPONENT_FACTORY_IDENTIFIER, [o.importType(compMeta.type)], [o.TypeModifier.Const])))
                .toDeclStmt(null, [o.StmtModifier.Final]));
            exportedVars.push(compFactoryVar);
        });
        return this._codegenSourceModule(moduleUrl, statements, exportedVars);
    }
    compileStylesheet(stylesheetUrl, cssText) {
        var plainStyles = this._styleCompiler.compileStylesheet(stylesheetUrl, cssText, false);
        var shimStyles = this._styleCompiler.compileStylesheet(stylesheetUrl, cssText, true);
        return [
            this._codegenSourceModule(_stylesModuleUrl(stylesheetUrl, false), _resolveStyleStatements(plainStyles), [plainStyles.stylesVar]),
            this._codegenSourceModule(_stylesModuleUrl(stylesheetUrl, true), _resolveStyleStatements(shimStyles), [shimStyles.stylesVar])
        ];
    }
    _compileComponent(compMeta, directives, pipes, targetStatements) {
        var styleResult = this._styleCompiler.compileComponent(compMeta);
        var parsedTemplate = this._templateParser.parse(compMeta, compMeta.template.template, directives, pipes, compMeta.type.name);
        var viewResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, o.variable(styleResult.stylesVar), pipes);
        ListWrapper.addAll(targetStatements, _resolveStyleStatements(styleResult));
        ListWrapper.addAll(targetStatements, _resolveViewStatements(viewResult));
        return viewResult.viewFactoryVar;
    }
    _codegenSourceModule(moduleUrl, statements, exportedVars) {
        return new SourceModule(moduleUrl, this._outputEmitter.emitStatements(moduleUrl, statements, exportedVars));
    }
}
function _resolveViewStatements(compileResult) {
    compileResult.dependencies.forEach((dep) => { dep.factoryPlaceholder.moduleUrl = _templateModuleUrl(dep.comp); });
    return compileResult.statements;
}
function _resolveStyleStatements(compileResult) {
    compileResult.dependencies.forEach((dep) => {
        dep.valuePlaceholder.moduleUrl = _stylesModuleUrl(dep.sourceUrl, dep.isShimmed);
    });
    return compileResult.statements;
}
function _templateModuleUrl(comp) {
    var moduleUrl = comp.type.moduleUrl;
    var urlWithoutSuffix = moduleUrl.substring(0, moduleUrl.length - MODULE_SUFFIX.length);
    return `${urlWithoutSuffix}.ngfactory${MODULE_SUFFIX}`;
}
function _stylesModuleUrl(stylesheetUrl, shim) {
    return shim ? `${stylesheetUrl}.shim${MODULE_SUFFIX}` : `${stylesheetUrl}${MODULE_SUFFIX}`;
}
function _assertComponent(meta) {
    if (!meta.isComponent) {
        throw new BaseException(`Could not compile '${meta.type.name}' because it is not a component.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmbGluZV9jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtVjJYemR6UGgudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9vZmZsaW5lX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBRUwseUJBQXlCLEVBRXpCLHVCQUF1QixFQUN4QixNQUFNLG9CQUFvQjtPQUVwQixFQUFDLGFBQWEsRUFBZ0IsTUFBTSxnQ0FBZ0M7T0FDcEUsRUFBQyxXQUFXLEVBQUMsTUFBTSxnQ0FBZ0M7T0FNbkQsS0FBSyxDQUFDLE1BQU0scUJBQXFCO09BQ2pDLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw0Q0FBNEM7T0FFcEUsRUFDTCxhQUFhLEVBQ2QsTUFBTSxRQUFRO0FBRWYsSUFBSSw2QkFBNkIsR0FBRyxJQUFJLHlCQUF5QixDQUFDO0lBQ2hFLElBQUksRUFBRSxrQkFBa0I7SUFDeEIsT0FBTyxFQUFFLGdCQUFnQjtJQUN6QixTQUFTLEVBQUUsdURBQXVELGFBQWEsRUFBRTtDQUNsRixDQUFDLENBQUM7QUFFSDtJQUNFLFlBQW1CLFNBQWlCLEVBQVMsTUFBYztRQUF4QyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFHLENBQUM7QUFDakUsQ0FBQztBQUVEO0lBQ0UsWUFBbUIsU0FBbUMsRUFDbkMsVUFBc0MsRUFBUyxLQUE0QjtRQUQzRSxjQUFTLEdBQVQsU0FBUyxDQUEwQjtRQUNuQyxlQUFVLEdBQVYsVUFBVSxDQUE0QjtRQUFTLFVBQUssR0FBTCxLQUFLLENBQXVCO0lBQUcsQ0FBQztBQUNwRyxDQUFDO0FBRUQ7SUFDRSxZQUFvQixvQkFBeUMsRUFDekMsZUFBK0IsRUFBVSxjQUE2QixFQUN0RSxhQUEyQixFQUFVLGNBQTZCO1FBRmxFLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBcUI7UUFDekMsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFDdEUsa0JBQWEsR0FBYixhQUFhLENBQWM7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtJQUFHLENBQUM7SUFFMUYsMEJBQTBCLENBQUMsU0FBbUM7UUFFNUQsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsVUFBbUQ7UUFDbEUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sSUFBSSxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBQ0QsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7WUFDbEMsSUFBSSxRQUFRLEdBQTZCLGlCQUFpQixDQUFDLFNBQVMsQ0FBQztZQUNyRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsVUFBVSxFQUN0QyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDckYsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRXRDLElBQUksUUFBUSxHQUFHLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pFLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN0RixJQUFJLGNBQWMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFXLENBQUM7WUFDdEQsVUFBVSxDQUFDLElBQUksQ0FDWCxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztpQkFDckIsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUNyRSxXQUFXLENBQ1I7Z0JBQ0UsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUM1QixDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDO2dCQUM5QixDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7YUFDNUIsRUFDRCxDQUFDLENBQUMsVUFBVSxDQUFDLDZCQUE2QixFQUM3QixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakYsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELGlCQUFpQixDQUFDLGFBQXFCLEVBQUUsT0FBZTtRQUN0RCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkYsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JGLE1BQU0sQ0FBQztZQUNMLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLEVBQ3RDLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hGLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQ3JDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZGLENBQUM7SUFDSixDQUFDO0lBRU8saUJBQWlCLENBQUMsUUFBa0MsRUFDbEMsVUFBc0MsRUFBRSxLQUE0QixFQUNwRSxnQkFBK0I7UUFDdkQsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQ3BDLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQ3hCLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9GLFdBQVcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsdUJBQXVCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUMzRSxXQUFXLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDekUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7SUFDbkMsQ0FBQztJQUdPLG9CQUFvQixDQUFDLFNBQWlCLEVBQUUsVUFBeUIsRUFDNUMsWUFBc0I7UUFDakQsTUFBTSxDQUFDLElBQUksWUFBWSxDQUNuQixTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7QUFDSCxDQUFDO0FBRUQsZ0NBQWdDLGFBQWdDO0lBQzlELGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUM5QixDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25GLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO0FBQ2xDLENBQUM7QUFHRCxpQ0FBaUMsYUFBa0M7SUFDakUsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHO1FBQ3JDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEYsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztBQUNsQyxDQUFDO0FBRUQsNEJBQTRCLElBQThCO0lBQ3hELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3BDLElBQUksZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkYsTUFBTSxDQUFDLEdBQUcsZ0JBQWdCLGFBQWEsYUFBYSxFQUFFLENBQUM7QUFDekQsQ0FBQztBQUVELDBCQUEwQixhQUFxQixFQUFFLElBQWE7SUFDNUQsTUFBTSxDQUFDLElBQUksR0FBRyxHQUFHLGFBQWEsUUFBUSxhQUFhLEVBQUUsR0FBRyxHQUFHLGFBQWEsR0FBRyxhQUFhLEVBQUUsQ0FBQztBQUM3RixDQUFDO0FBRUQsMEJBQTBCLElBQThCO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxJQUFJLGFBQWEsQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLGtDQUFrQyxDQUFDLENBQUM7SUFDbEcsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gIENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEsXG4gIENvbXBpbGVQaXBlTWV0YWRhdGEsXG4gIGNyZWF0ZUhvc3RDb21wb25lbnRNZXRhXG59IGZyb20gJy4vY29tcGlsZV9tZXRhZGF0YSc7XG5cbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgdW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1N0eWxlQ29tcGlsZXIsIFN0eWxlc0NvbXBpbGVEZXBlbmRlbmN5LCBTdHlsZXNDb21waWxlUmVzdWx0fSBmcm9tICcuL3N0eWxlX2NvbXBpbGVyJztcbmltcG9ydCB7Vmlld0NvbXBpbGVyLCBWaWV3Q29tcGlsZVJlc3VsdH0gZnJvbSAnLi92aWV3X2NvbXBpbGVyL3ZpZXdfY29tcGlsZXInO1xuaW1wb3J0IHtUZW1wbGF0ZVBhcnNlcn0gZnJvbSAnLi90ZW1wbGF0ZV9wYXJzZXInO1xuaW1wb3J0IHtEaXJlY3RpdmVOb3JtYWxpemVyfSBmcm9tICcuL2RpcmVjdGl2ZV9ub3JtYWxpemVyJztcbmltcG9ydCB7T3V0cHV0RW1pdHRlcn0gZnJvbSAnLi9vdXRwdXQvYWJzdHJhY3RfZW1pdHRlcic7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvY29tcG9uZW50X2ZhY3RvcnknO1xuXG5pbXBvcnQge1xuICBNT0RVTEVfU1VGRklYLFxufSBmcm9tICcuL3V0aWwnO1xuXG52YXIgX0NPTVBPTkVOVF9GQUNUT1JZX0lERU5USUZJRVIgPSBuZXcgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSh7XG4gIG5hbWU6ICdDb21wb25lbnRGYWN0b3J5JyxcbiAgcnVudGltZTogQ29tcG9uZW50RmFjdG9yeSxcbiAgbW9kdWxlVXJsOiBgYXNzZXQ6YW5ndWxhcjIvbGliL3NyYy9jb3JlL2xpbmtlci9jb21wb25lbnRfZmFjdG9yeSR7TU9EVUxFX1NVRkZJWH1gXG59KTtcblxuZXhwb3J0IGNsYXNzIFNvdXJjZU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtb2R1bGVVcmw6IHN0cmluZywgcHVibGljIHNvdXJjZTogc3RyaW5nKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTm9ybWFsaXplZENvbXBvbmVudFdpdGhWaWV3RGlyZWN0aXZlcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgcHVibGljIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLCBwdWJsaWMgcGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSkge31cbn1cblxuZXhwb3J0IGNsYXNzIE9mZmxpbmVDb21waWxlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RpcmVjdGl2ZU5vcm1hbGl6ZXI6IERpcmVjdGl2ZU5vcm1hbGl6ZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3RlbXBsYXRlUGFyc2VyOiBUZW1wbGF0ZVBhcnNlciwgcHJpdmF0ZSBfc3R5bGVDb21waWxlcjogU3R5bGVDb21waWxlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld0NvbXBpbGVyOiBWaWV3Q29tcGlsZXIsIHByaXZhdGUgX291dHB1dEVtaXR0ZXI6IE91dHB1dEVtaXR0ZXIpIHt9XG5cbiAgbm9ybWFsaXplRGlyZWN0aXZlTWV0YWRhdGEoZGlyZWN0aXZlOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOlxuICAgICAgUHJvbWlzZTxDb21waWxlRGlyZWN0aXZlTWV0YWRhdGE+IHtcbiAgICByZXR1cm4gdGhpcy5fZGlyZWN0aXZlTm9ybWFsaXplci5ub3JtYWxpemVEaXJlY3RpdmUoZGlyZWN0aXZlKTtcbiAgfVxuXG4gIGNvbXBpbGVUZW1wbGF0ZXMoY29tcG9uZW50czogTm9ybWFsaXplZENvbXBvbmVudFdpdGhWaWV3RGlyZWN0aXZlc1tdKTogU291cmNlTW9kdWxlIHtcbiAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdObyBjb21wb25lbnRzIGdpdmVuJyk7XG4gICAgfVxuICAgIHZhciBzdGF0ZW1lbnRzID0gW107XG4gICAgdmFyIGV4cG9ydGVkVmFycyA9IFtdO1xuICAgIHZhciBtb2R1bGVVcmwgPSBfdGVtcGxhdGVNb2R1bGVVcmwoY29tcG9uZW50c1swXS5jb21wb25lbnQpO1xuICAgIGNvbXBvbmVudHMuZm9yRWFjaChjb21wb25lbnRXaXRoRGlycyA9PiB7XG4gICAgICB2YXIgY29tcE1ldGEgPSA8Q29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhPmNvbXBvbmVudFdpdGhEaXJzLmNvbXBvbmVudDtcbiAgICAgIF9hc3NlcnRDb21wb25lbnQoY29tcE1ldGEpO1xuICAgICAgdmFyIGNvbXBWaWV3RmFjdG9yeVZhciA9IHRoaXMuX2NvbXBpbGVDb21wb25lbnQoY29tcE1ldGEsIGNvbXBvbmVudFdpdGhEaXJzLmRpcmVjdGl2ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRXaXRoRGlycy5waXBlcywgc3RhdGVtZW50cyk7XG4gICAgICBleHBvcnRlZFZhcnMucHVzaChjb21wVmlld0ZhY3RvcnlWYXIpO1xuXG4gICAgICB2YXIgaG9zdE1ldGEgPSBjcmVhdGVIb3N0Q29tcG9uZW50TWV0YShjb21wTWV0YS50eXBlLCBjb21wTWV0YS5zZWxlY3Rvcik7XG4gICAgICB2YXIgaG9zdFZpZXdGYWN0b3J5VmFyID0gdGhpcy5fY29tcGlsZUNvbXBvbmVudChob3N0TWV0YSwgW2NvbXBNZXRhXSwgW10sIHN0YXRlbWVudHMpO1xuICAgICAgdmFyIGNvbXBGYWN0b3J5VmFyID0gYCR7Y29tcE1ldGEudHlwZS5uYW1lfU5nRmFjdG9yeWA7XG4gICAgICBzdGF0ZW1lbnRzLnB1c2goXG4gICAgICAgICAgby52YXJpYWJsZShjb21wRmFjdG9yeVZhcilcbiAgICAgICAgICAgICAgLnNldChvLmltcG9ydEV4cHIoX0NPTVBPTkVOVF9GQUNUT1JZX0lERU5USUZJRVIsIFtvLmltcG9ydFR5cGUoY29tcE1ldGEudHlwZSldKVxuICAgICAgICAgICAgICAgICAgICAgICAuaW5zdGFudGlhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChjb21wTWV0YS5zZWxlY3RvciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8udmFyaWFibGUoaG9zdFZpZXdGYWN0b3J5VmFyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5pbXBvcnRFeHByKGNvbXBNZXRhLnR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgby5pbXBvcnRUeXBlKF9DT01QT05FTlRfRkFDVE9SWV9JREVOVElGSUVSLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtvLmltcG9ydFR5cGUoY29tcE1ldGEudHlwZSldLCBbby5UeXBlTW9kaWZpZXIuQ29uc3RdKSkpXG4gICAgICAgICAgICAgIC50b0RlY2xTdG10KG51bGwsIFtvLlN0bXRNb2RpZmllci5GaW5hbF0pKTtcbiAgICAgIGV4cG9ydGVkVmFycy5wdXNoKGNvbXBGYWN0b3J5VmFyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5fY29kZWdlblNvdXJjZU1vZHVsZShtb2R1bGVVcmwsIHN0YXRlbWVudHMsIGV4cG9ydGVkVmFycyk7XG4gIH1cblxuICBjb21waWxlU3R5bGVzaGVldChzdHlsZXNoZWV0VXJsOiBzdHJpbmcsIGNzc1RleHQ6IHN0cmluZyk6IFNvdXJjZU1vZHVsZVtdIHtcbiAgICB2YXIgcGxhaW5TdHlsZXMgPSB0aGlzLl9zdHlsZUNvbXBpbGVyLmNvbXBpbGVTdHlsZXNoZWV0KHN0eWxlc2hlZXRVcmwsIGNzc1RleHQsIGZhbHNlKTtcbiAgICB2YXIgc2hpbVN0eWxlcyA9IHRoaXMuX3N0eWxlQ29tcGlsZXIuY29tcGlsZVN0eWxlc2hlZXQoc3R5bGVzaGVldFVybCwgY3NzVGV4dCwgdHJ1ZSk7XG4gICAgcmV0dXJuIFtcbiAgICAgIHRoaXMuX2NvZGVnZW5Tb3VyY2VNb2R1bGUoX3N0eWxlc01vZHVsZVVybChzdHlsZXNoZWV0VXJsLCBmYWxzZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXNvbHZlU3R5bGVTdGF0ZW1lbnRzKHBsYWluU3R5bGVzKSwgW3BsYWluU3R5bGVzLnN0eWxlc1Zhcl0pLFxuICAgICAgdGhpcy5fY29kZWdlblNvdXJjZU1vZHVsZShfc3R5bGVzTW9kdWxlVXJsKHN0eWxlc2hlZXRVcmwsIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzb2x2ZVN0eWxlU3RhdGVtZW50cyhzaGltU3R5bGVzKSwgW3NoaW1TdHlsZXMuc3R5bGVzVmFyXSlcbiAgICBdO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tcGlsZUNvbXBvbmVudChjb21wTWV0YTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLCBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10pOiBzdHJpbmcge1xuICAgIHZhciBzdHlsZVJlc3VsdCA9IHRoaXMuX3N0eWxlQ29tcGlsZXIuY29tcGlsZUNvbXBvbmVudChjb21wTWV0YSk7XG4gICAgdmFyIHBhcnNlZFRlbXBsYXRlID0gdGhpcy5fdGVtcGxhdGVQYXJzZXIucGFyc2UoY29tcE1ldGEsIGNvbXBNZXRhLnRlbXBsYXRlLnRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMsIHBpcGVzLCBjb21wTWV0YS50eXBlLm5hbWUpO1xuICAgIHZhciB2aWV3UmVzdWx0ID0gdGhpcy5fdmlld0NvbXBpbGVyLmNvbXBpbGVDb21wb25lbnQoY29tcE1ldGEsIHBhcnNlZFRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby52YXJpYWJsZShzdHlsZVJlc3VsdC5zdHlsZXNWYXIpLCBwaXBlcyk7XG4gICAgTGlzdFdyYXBwZXIuYWRkQWxsKHRhcmdldFN0YXRlbWVudHMsIF9yZXNvbHZlU3R5bGVTdGF0ZW1lbnRzKHN0eWxlUmVzdWx0KSk7XG4gICAgTGlzdFdyYXBwZXIuYWRkQWxsKHRhcmdldFN0YXRlbWVudHMsIF9yZXNvbHZlVmlld1N0YXRlbWVudHModmlld1Jlc3VsdCkpO1xuICAgIHJldHVybiB2aWV3UmVzdWx0LnZpZXdGYWN0b3J5VmFyO1xuICB9XG5cblxuICBwcml2YXRlIF9jb2RlZ2VuU291cmNlTW9kdWxlKG1vZHVsZVVybDogc3RyaW5nLCBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydGVkVmFyczogc3RyaW5nW10pOiBTb3VyY2VNb2R1bGUge1xuICAgIHJldHVybiBuZXcgU291cmNlTW9kdWxlKFxuICAgICAgICBtb2R1bGVVcmwsIHRoaXMuX291dHB1dEVtaXR0ZXIuZW1pdFN0YXRlbWVudHMobW9kdWxlVXJsLCBzdGF0ZW1lbnRzLCBleHBvcnRlZFZhcnMpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVzb2x2ZVZpZXdTdGF0ZW1lbnRzKGNvbXBpbGVSZXN1bHQ6IFZpZXdDb21waWxlUmVzdWx0KTogby5TdGF0ZW1lbnRbXSB7XG4gIGNvbXBpbGVSZXN1bHQuZGVwZW5kZW5jaWVzLmZvckVhY2goXG4gICAgICAoZGVwKSA9PiB7IGRlcC5mYWN0b3J5UGxhY2Vob2xkZXIubW9kdWxlVXJsID0gX3RlbXBsYXRlTW9kdWxlVXJsKGRlcC5jb21wKTsgfSk7XG4gIHJldHVybiBjb21waWxlUmVzdWx0LnN0YXRlbWVudHM7XG59XG5cblxuZnVuY3Rpb24gX3Jlc29sdmVTdHlsZVN0YXRlbWVudHMoY29tcGlsZVJlc3VsdDogU3R5bGVzQ29tcGlsZVJlc3VsdCk6IG8uU3RhdGVtZW50W10ge1xuICBjb21waWxlUmVzdWx0LmRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXApID0+IHtcbiAgICBkZXAudmFsdWVQbGFjZWhvbGRlci5tb2R1bGVVcmwgPSBfc3R5bGVzTW9kdWxlVXJsKGRlcC5zb3VyY2VVcmwsIGRlcC5pc1NoaW1tZWQpO1xuICB9KTtcbiAgcmV0dXJuIGNvbXBpbGVSZXN1bHQuc3RhdGVtZW50cztcbn1cblxuZnVuY3Rpb24gX3RlbXBsYXRlTW9kdWxlVXJsKGNvbXA6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSk6IHN0cmluZyB7XG4gIHZhciBtb2R1bGVVcmwgPSBjb21wLnR5cGUubW9kdWxlVXJsO1xuICB2YXIgdXJsV2l0aG91dFN1ZmZpeCA9IG1vZHVsZVVybC5zdWJzdHJpbmcoMCwgbW9kdWxlVXJsLmxlbmd0aCAtIE1PRFVMRV9TVUZGSVgubGVuZ3RoKTtcbiAgcmV0dXJuIGAke3VybFdpdGhvdXRTdWZmaXh9Lm5nZmFjdG9yeSR7TU9EVUxFX1NVRkZJWH1gO1xufVxuXG5mdW5jdGlvbiBfc3R5bGVzTW9kdWxlVXJsKHN0eWxlc2hlZXRVcmw6IHN0cmluZywgc2hpbTogYm9vbGVhbik6IHN0cmluZyB7XG4gIHJldHVybiBzaGltID8gYCR7c3R5bGVzaGVldFVybH0uc2hpbSR7TU9EVUxFX1NVRkZJWH1gIDogYCR7c3R5bGVzaGVldFVybH0ke01PRFVMRV9TVUZGSVh9YDtcbn1cblxuZnVuY3Rpb24gX2Fzc2VydENvbXBvbmVudChtZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpIHtcbiAgaWYgKCFtZXRhLmlzQ29tcG9uZW50KSB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYENvdWxkIG5vdCBjb21waWxlICcke21ldGEudHlwZS5uYW1lfScgYmVjYXVzZSBpdCBpcyBub3QgYSBjb21wb25lbnQuYCk7XG4gIH1cbn1cbiJdfQ==