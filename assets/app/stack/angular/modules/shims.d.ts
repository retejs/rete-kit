declare module THREE {
  const o: { new(...args: any[]): any } & Record<string, any>
  export class OrbitControls extends o { constructor(...args: any[]); }
  export class CSS3DObject extends o { constructor(...args: any[]); }
  export class CSS3DRenderer extends o { constructor(...args: any[]); }
  export class Scene extends o { constructor(...args: any[]); add(...args: any[]): void }
  export class PerspectiveCamera extends o { constructor(...args: any[]); }
  export class Euler extends o { constructor(...args: any[]); }
  export class Vector3 extends o { constructor(...args: any[]); }
  export class Vector2 extends o { constructor(...args: any[]); }
  export class Camera extends o { constructor(...args: any[]); }
  export class ShadowMaterial extends o { constructor(...args: any[]); }
  export class MeshBasicMaterial extends o { constructor(...args: any[]); }
  export class Mesh extends o { constructor(...args: any[]); }
  export class Material extends o { constructor(...args: any[]); }
  export class BufferGeometry<E = any> extends o { constructor(...args: any[]); }
  export class WebGLRenderer extends o { constructor(...args: any[]); }
  export class Object3D<E = any> extends o { constructor(...args: any[]); }
  export class Plane extends o { constructor(...args: any[]); }
  export class Event extends o { constructor(...args: any[]); }
  export class Raycaster extends o { constructor(...args: any[]); }
  export class Intersection<E = any> extends o { constructor(...args: any[]); }
  export class EventDispatcher extends o { constructor(...args: any[]); }
  export class NormalBufferAttributes extends o { constructor(...args: any[]); }
  export class AxesHelper extends o { constructor(...args: any[]); }
  export class GridHelper extends o { constructor(...args: any[]); }
}

declare module 'three*' {
  export = THREE
}
