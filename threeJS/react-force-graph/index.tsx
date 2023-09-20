import React, { useRef, useEffect } from "react";
import { ForceGraph3D } from "react-force-graph";
import SpriteText from "three-spritetext";

interface Graph3DProps {
  data: any;
  prunedTree: any;
  width: number;
  nodesById: any;
  height: number;
  config: any[];
  center: boolean;
  module: any;
  modules: any[];
  handleClick: (node: any) => void;
  handlePicture: (dataURL: string) => void;
}

export const Graph3D: React.FC<Graph3DProps> = ({
  data,
  prunedTree,
  width,
  nodesById,
  height,
  config,
  center,
  module,
  modules,
  handleClick,
  handlePicture,
}) => {
  const g3Ref = useRef<any>(null);
  const centRef = useRef<boolean>(false);

  useEffect(() => {
    g3Ref.current
      .d3Force("link")
      .distance((link) => 90)
      .strength(
        (link) => 0.5 / Math.min(count(link.source), count(link.target))
      );
  }, []);

  useEffect(() => {
    if (centRef.current) {
      centerGraph();
    } else {
      centRef.current = true;
    }
  }, [center]);

  useEffect(() => {
    if (!module) {
      setTimeout(() => centerGraph(), 3000);
    }
  }, [data]);

  useEffect(() => {
    if (handlePicture && g3Ref.current) {
      handlePicture(
        g3Ref.current.renderer().domElement.toDataURL("image/jpeg")
      );
    }
  }, [handlePicture]);

  useEffect(() => {
    if (module && config[3]) {
      const node = nodesById[module.id];
      if (node) {
        const distance = 500;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        setTimeout(() => {
          if (g3Ref.current) {
            g3Ref.current.cameraPosition(
              {
                x: node.x * distRatio,
                y: node.y * distRatio,
                z: node.z * distRatio,
              },
              node,
              2000
            );
          }
        }, 1500);
      }
    }
  }, [module, config[3], nodesById]);

  const centerGraph = () => {
    if (g3Ref.current) {
      g3Ref.current.zoomToFit(1000);
    }
  };

  return (
    <div>
      <ForceGraph3D
        ref={g3Ref}
        width={width}
        height={height}
        graphData={prunedTree}
        nodeAutoColorBy={(d) => d.typeId}
        linkAutoColorBy={(d) => d.id}
        linkOpacity={0.3}
        linkWidth={0.8}
        onNodeClick={handleClick}
        linkThreeObjectExtend={true}
        linkThreeObject={(link) => {
          const sprite = new SpriteText(
            module &&
            (link.source.id === module.id || link.target.id === module.id)
              ? `${link.name}`
              : " "
          );
          sprite.color = "lightgrey";
          sprite.textHeight = 6.5;
          return sprite;
        }}
        linkPositionUpdate={(sprite, { start, end }) => {
          const middlePos = Object.assign(
            ...["x", "y", "z"].map((c) => ({
              [c]: start[c] + (end[c] - start[c]) / 2,
            }))
          );
          Object.assign(sprite.position, middlePos);
        }}
        nodeThreeObject={
          config[1] === "text"
            ? (node, ctx, gs) => nodeThree(node, ctx)
            : (node) => {
                if (node.image) {
                  const loader = new THREE.TextureLoader();
                  const imgTexture = loader.load(node.image);
                  const material = new THREE.SpriteMaterial({
                    map: imgTexture,
                  });
                  const sprite = new THREE.Sprite(material);
                  sprite.scale.set(40, 40);
                  return sprite;
                } else {
                  return null;
                }
              }
        }
        showNavInfo={false}
        enableNodeDrag={false}
        rendererConfig={{
          preserveDrawingBuffer: true,
        }}
      />
    </div>
  );
};

const nodeThree = (node: any, gs: any) => {
  const sprite = new SpriteText(node.name);
  sprite.color = node.color;
  sprite.textHeight = 16;
  return sprite;
};

const count = (side: any) => {
  return (
    side.childLinks.filter((l: any) => l.permVisible || l.visible).length + 1
  );
};
