/**
 * 使用该文件的函数时，需要使用call函数，否则会导致lua文件中多nil参数
 * 如：GetDistanceBetweenTwoVec2D.call(a, b)
 */

/**
 * @param a 原点向量
 * @param b 目标向量
 * @returns 两个向量的距离
 */
declare function GetDistanceBetweenTwoVec2D(a: Vector, b: Vector): number;
declare function GetRadBetweenTwoVec2D(a: Vector, b: Vector): number;
/**
 * @param aVec 原点向量
 * @param rectOrigin 单位原点向量
 * @param rectWidth 矩形宽度
 * @param rectLenth 矩形长度
 * @param rectRad 矩形相对Y轴旋转角度
 */
declare function IsRadInRect(aVec: Vector, rectOrigin: Vector, rectWidth: number, rectLenth: number, rectRad: Vector): boolean;
declare function IsRadBetweenTwoRad2D(a: number, rada: number, radb: number): boolean;
/**
 * @param cx 目标的x
 * @param cy 目标的y
 * @param ux math.cos(theta) (rad是caster和target的夹角的弧度制表示)
 * @param uy math.sin(theta) (rad是caster和target的夹角的弧度制表示)
 * @param r 目标和原点之间的距离
 * @param theta 夹角的弧度制
 * @param px 原点的x
 * @param py 原点的y
 * @returns 目标是否在扇形内，在的话=true，不在=false
 */
declare function IsPointInCircularSector(cx: number, cy: number, ux: number, uy: number, r: number, theta: number, px: number, py: number): boolean;
