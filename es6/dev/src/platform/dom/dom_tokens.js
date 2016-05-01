import { OpaqueToken } from 'angular2/src/core/di';
/**
 * A DI Token representing the main rendering context. In a browser this is the DOM Document.
 *
 * Note: Document might not be available in the Application Context when Application and Rendering
 * Contexts are not the same (e.g. when running the application into a Web Worker).
 */
export const DOCUMENT = new OpaqueToken('DocumentToken');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3Rva2Vucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtVjJYemR6UGgudG1wL2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3Rva2Vucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHNCQUFzQjtBQUVoRDs7Ozs7R0FLRztBQUNILE9BQU8sTUFBTSxRQUFRLEdBQW1DLElBQUksV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtPcGFxdWVUb2tlbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuXG4vKipcbiAqIEEgREkgVG9rZW4gcmVwcmVzZW50aW5nIHRoZSBtYWluIHJlbmRlcmluZyBjb250ZXh0LiBJbiBhIGJyb3dzZXIgdGhpcyBpcyB0aGUgRE9NIERvY3VtZW50LlxuICpcbiAqIE5vdGU6IERvY3VtZW50IG1pZ2h0IG5vdCBiZSBhdmFpbGFibGUgaW4gdGhlIEFwcGxpY2F0aW9uIENvbnRleHQgd2hlbiBBcHBsaWNhdGlvbiBhbmQgUmVuZGVyaW5nXG4gKiBDb250ZXh0cyBhcmUgbm90IHRoZSBzYW1lIChlLmcuIHdoZW4gcnVubmluZyB0aGUgYXBwbGljYXRpb24gaW50byBhIFdlYiBXb3JrZXIpLlxuICovXG5leHBvcnQgY29uc3QgRE9DVU1FTlQ6IE9wYXF1ZVRva2VuID0gLypAdHMyZGFydF9jb25zdCovIG5ldyBPcGFxdWVUb2tlbignRG9jdW1lbnRUb2tlbicpO1xuIl19