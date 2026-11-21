import * as T from 'three';

// The painted faces retain the fine pen work at the atlas's fixed viewing angle.
// Curved relief gives each silhouette depth and casts a shadow onto the lane.
export const viewOffset = new T.Vector3(-19,54,68);
const azimuth = Math.atan2(viewOffset.x,viewOffset.z);
const elevation = Math.atan2(viewOffset.y,Math.hypot(viewOffset.x,viewOffset.z));

export function reliefGeometry() {
  const geometry = new T.PlaneGeometry(1, 1, 20, 24);
  const points = geometry.attributes.position;
  for (let i = 0; i < points.count; i++) {
    const x = points.getX(i), y = points.getY(i) + .5;
    const profile = Math.sin(Math.PI * y) * Math.max(0, 1 - 4 * x * x);
    points.setXYZ(i, x, y, profile * (.16 + .018 * Math.cos(x * 14 + y * 8)));
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function paintedMaterial(texture) {
  texture.colorSpace = T.SRGBColorSpace;
  return new T.MeshBasicMaterial({ map: texture, alphaTest: .35, side: T.DoubleSide });
}

export function placeRelief(mesh, x, z, width, height, depth) {
  mesh.position.set(x, .055, z);
  mesh.rotation.order = 'YXZ';
  mesh.rotation.y = azimuth;
  mesh.rotation.x = -elevation;
  mesh.scale.set(width, height, depth);
  mesh.updateMatrix();
  return mesh;
}
