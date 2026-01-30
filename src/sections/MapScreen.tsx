import { useState } from 'react';
import { 
  Swords, 
  Shield, 
  Heart, 
  Sparkles, 
  Crown,
  MapPin,
  ChevronRight
} from 'lucide-react';
import type { MapNode } from '@/types/game';

interface MapScreenProps {
  nodes: MapNode[];
  currentNode: string;
  onSelectNode: (nodeId: string) => void;
}

const NODE_ICONS: Record<MapNode['type'], React.ReactNode> = {
  battle: <Swords className="w-6 h-6" />,
  elite: <Shield className="w-6 h-6" />,
  shop: <Sparkles className="w-6 h-6" />,
  rest: <Heart className="w-6 h-6" />,
  boss: <Crown className="w-6 h-6" />,
  event: <Sparkles className="w-6 h-6" />,
};

const NODE_COLORS: Record<MapNode['type'], string> = {
  battle: 'from-red-600 to-orange-600',
  elite: 'from-purple-600 to-pink-600',
  shop: 'from-yellow-600 to-orange-600',
  rest: 'from-green-600 to-teal-600',
  boss: 'from-pink-600 to-purple-600',
  event: 'from-cyan-600 to-blue-600',
};

const NODE_BORDER_COLORS: Record<MapNode['type'], string> = {
  battle: 'border-red-500',
  elite: 'border-purple-500',
  shop: 'border-yellow-500',
  rest: 'border-green-500',
  boss: 'border-pink-500',
  event: 'border-cyan-500',
};

export function MapScreen({ nodes, currentNode, onSelectNode }: MapScreenProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // 获取当前节点
  const currentNodeData = nodes.find(n => n.id === currentNode);
  
  // 获取可到达的节点（与当前节点相连的未访问节点）
  const reachableNodes = currentNodeData?.connections || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8 relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* 标题 */}
      <div className="relative z-10 text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          选择路径
        </h2>
        <p className="text-slate-400 mt-2">选择下一个目的地</p>
      </div>

      {/* 地图画布 */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ minHeight: '600px' }}
        >
          {/* 绘制连接线 */}
          {nodes.map(node => 
            node.connections.map(targetId => {
              const target = nodes.find(n => n.id === targetId);
              if (!target) return null;
              
              const isPath = node.visited || node.current || target.id === currentNode;
              
              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isPath ? 'rgba(0, 255, 255, 0.3)' : 'rgba(100, 100, 100, 0.2)'}
                  strokeWidth={isPath ? 3 : 1}
                  strokeDasharray={isPath ? 'none' : '5,5'}
                />
              );
            })
          )}
        </svg>

        {/* 节点 */}
        <div className="relative" style={{ minHeight: '600px' }}>
          {nodes.map(node => {
            const isReachable = reachableNodes.includes(node.id);
            const isCurrent = node.id === currentNode;
            const isVisited = node.visited;
            const isHovered = hoveredNode === node.id;

            return (
              <div
                key={node.id}
                className={`
                  absolute transform -translate-x-1/2 -translate-y-1/2
                  transition-all duration-300
                  ${isReachable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                `}
                style={{ left: node.x, top: node.y }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => isReachable && onSelectNode(node.id)}
              >
                {/* 节点圆圈 */}
                <div
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    bg-gradient-to-br ${NODE_COLORS[node.type]}
                    border-4 transition-all duration-300
                    ${isCurrent ? 'border-white shadow-lg shadow-white/50 scale-110' : ''}
                    ${isVisited && !isCurrent ? 'border-slate-500 opacity-60' : ''}
                    ${isReachable && !isCurrent ? NODE_BORDER_COLORS[node.type] : ''}
                    ${!isReachable && !isCurrent ? 'border-slate-700 opacity-40' : ''}
                    ${isHovered && isReachable ? 'shadow-lg scale-110' : ''}
                  `}
                  style={{
                    boxShadow: isHovered && isReachable 
                      ? `0 0 30px ${node.type === 'battle' ? '#ef4444' : 
                          node.type === 'elite' ? '#a855f7' :
                          node.type === 'shop' ? '#eab308' :
                          node.type === 'rest' ? '#22c55e' :
                          node.type === 'boss' ? '#ec4899' : '#06b6d4'}` 
                      : 'none',
                  }}
                >
                  <span className={`
                    ${isCurrent ? 'text-white' : 'text-slate-200'}
                    ${!isReachable && !isCurrent ? 'opacity-50' : ''}
                  `}>
                    {NODE_ICONS[node.type]}
                  </span>
                </div>

                {/* 节点标签 */}
                <div className={`
                  absolute -bottom-8 left-1/2 -translate-x-1/2
                  text-xs font-medium whitespace-nowrap
                  transition-all duration-300
                  ${isCurrent ? 'text-white' : 'text-slate-400'}
                  ${isHovered && isReachable ? 'text-cyan-400' : ''}
                `}>
                  {node.type === 'battle' && '战斗'}
                  {node.type === 'elite' && '精英'}
                  {node.type === 'shop' && '商店'}
                  {node.type === 'rest' && '休息'}
                  {node.type === 'boss' && 'BOSS'}
                  {node.type === 'event' && '事件'}
                </div>

                {/* 当前位置标记 */}
                {isCurrent && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <MapPin className="w-6 h-6 text-cyan-400 animate-bounce" />
                  </div>
                )}

                {/* 可到达提示 */}
                {isReachable && !isCurrent && (
                  <div className="absolute -right-2 -top-2">
                    <ChevronRight className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 图例 */}
      <div className="relative z-10 mt-8 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-600 to-orange-600" />
          <span>战斗</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-600" />
          <span>精英</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-600 to-orange-600" />
          <span>商店</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-600 to-teal-600" />
          <span>休息</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-600 to-purple-600" />
          <span>BOSS</span>
        </div>
      </div>
    </div>
  );
}
