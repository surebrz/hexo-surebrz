title: RMMV 简易的诅咒装备
date: 2025-09-17 21:47:12
tags: [javascript,rmmv]
categories: RPG Maker
---
装备上后就无法脱下的装备，用法见脚本内容。

````JavaScript
//=============================================================================
/*:
* SimpleCursedEquip.js
* @plugindesc v1.00 不可卸下的装备
* @author 烁灵 更多脚本请访问 www.hknmtt.com
*
* @help
* 在物品备注中填写：
* <诅咒装备>
* 则该装备无法被卸下
* 可以用插件指令
* $gameParty.members()[index].forceChangeEquip(slotId, null); 
* 来强制卸下装备，index为队员序号（从0开始）slotId为装备槽位序号（从0开始）
*/
//=============================================================================
(function(){
    var sl_Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk
    Game_Actor.prototype.isEquipChangeOk = function(slotId) {
        var origResult = sl_Game_Actor_isEquipChangeOk.apply(this, arguments);
        var equip = this.equips()[slotId];
        var cursed = equip && equip.note && equip.note.indexOf("<诅咒装备>") >= 0;
        return origResult && !cursed;
    };
})()
````
