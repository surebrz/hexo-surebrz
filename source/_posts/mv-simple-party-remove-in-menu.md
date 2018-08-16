title: 【RMMV插件】整队时移除队员
date: 2016-05-05 19:01:07
tags: [javascript,rmmv]
categories: RPG Maker
---

# 功能

简易在整队列表中增加移除队员功能，连点选中角色呼出离队选项。

<!--more-->

* 在数据库 角色 注释 中添加注释<removable>才可在整队中离队
* 在数据库 角色 注释 中添加注释<removable:ID>可以在离队时呼出公共事件（立即回到地图执行）

## 代码

````ruby

//=============================================================================
// Remove Party Actor in Menu
// by SureBrz
//=============================================================================

/*:
 * @plugindesc 菜单中可以使队员离队 v0.0.2
 * @author SureBrz
 *
 * @help This plugin does not provide plugin commands.
 *
 * 在角色注释中添加 <removable> 使角色可在菜单中手动离队，
 * 注释为 <removable:ID> 使离队后触发ID对应的公共事件
 *
 */

(function() {

  Game_Actor.prototype.removableInMenu = function() {
    console.log([this.actor().note.match(/<removable:(\d+)?>/),
      this.actor().note.match(/<removable>/)]);
    return this.actor().note.match(/<removable:(\d+)?>/) ||
      this.actor().note.match(/<removable>/);
  };
  Game_Actor.prototype.removeCommonEventId = function() {
    if(this.actor().note.match(/<removable:(\d+)?>/)) {
      return parseInt(RegExp.$1);
    }
    return 0;
  };


  function Window_FormationRemoveChoice() {
      this.initialize.apply(this, arguments);
  }

  Window_FormationRemoveChoice.prototype = Object.create(Window_Command.prototype);
  Window_FormationRemoveChoice.prototype.constructor = Window_FormationRemoveChoice;

  Window_FormationRemoveChoice.prototype.initialize = function() {
      Window_Command.prototype.initialize.call(this, 0, 0);
      this.openness = 0;
      this.deactivate();
      this._background = 0;
  };
  Window_FormationRemoveChoice.prototype.makeCommandList = function() {
    this.addCommand('离队', 'remove', true);
  };

  function Window_FormationRemoveConfirm() {
      this.initialize.apply(this, arguments);
  }
  Window_FormationRemoveConfirm.prototype = Object.create(Window_HorzCommand.prototype);
  Window_FormationRemoveConfirm.prototype.constructor = Window_FormationRemoveConfirm;

  Window_FormationRemoveConfirm.prototype.initialize = function() {
      Window_HorzCommand.prototype.initialize.call(this, 0, 0);
      this.openness = 0;
      this.deactivate();
      this._background = 0;
  };
  Window_FormationRemoveConfirm.prototype.maxCols = function() {
    return 2;
  };
  Window_FormationRemoveConfirm.prototype.makeCommandList = function() {
    this.addCommand('确认', 'remove', true);
    this.addCommand('取消', 'cancel', true);
  };

  var _Scene_Menu_prototype_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function() {
    _Scene_Menu_prototype_create.call(this);
    this.createFormationCommandWindow();
  };
  Scene_Menu.prototype.createFormationCommandWindow = function() {
    this._formationCommandWindow = new Window_FormationRemoveChoice();
    this._formationCommandWindow.setHandler('remove', this.commandRemoveActor.bind(this));
    this._formationCommandWindow.setHandler('cancel', this.commandRemoveActorCancel.bind(this));
    this.addWindow(this._formationCommandWindow);
    this._formationCommandConfirmWindow = new Window_FormationRemoveConfirm();
    this._formationCommandConfirmWindow.setHandler('remove', this.commandRemoveActorConfirm.bind(this));
    this._formationCommandConfirmWindow.setHandler('cancel', this.commandRemoveActorCancel.bind(this));
    this.addWindow(this._formationCommandConfirmWindow);
    this._formationCommandConfirmWindow.close();
  };
  Scene_Menu.prototype.commandRemoveActor = function() {
    this._formationCommandConfirmWindow.x = this._formationCommandWindow.x + 
                                        this._formationCommandWindow.width / 2 -
                                        this._formationCommandConfirmWindow.width / 2;
    if (this._formationCommandWindow.y > Graphics.height / 2) {
      this._formationCommandConfirmWindow.y = this._formationCommandWindow.y -  
                                          this._formationCommandConfirmWindow.height - 32;
    } else {
      this._formationCommandConfirmWindow.y = this._formationCommandWindow.y + 
                                          this._formationCommandWindow.height + 32;
    }
    this._formationCommandWindow.deselect();
    this._formationCommandConfirmWindow.open();
    this._formationCommandConfirmWindow.select(0);
    this._formationCommandConfirmWindow.activate();                                                                     
  };
  Scene_Menu.prototype.commandRemoveActorCancel = function() {
    this._formationCommandWindow.deselect();
    this._formationCommandWindow.close();
    this._statusWindow.activate();
  };
  Scene_Menu.prototype.commandRemoveActorConfirm = function() {
    var index = this._statusWindow.index();
    var actor = $gameParty.members()[index];
    var commonEventId = actor.removeCommonEventId();
    if (commonEventId != 0) {
      $gameParty.removeActor(actor.actorId());
      $gameTemp.reserveCommonEvent(commonEventId);
      SceneManager.goto(Scene_Map);
    } else {
      $gameParty.makeMenuActorPrevious();
      this._statusWindow.selectLast();
      this._formationCommandWindow.close();
      this._formationCommandConfirmWindow.deselect();
      this._formationCommandConfirmWindow.close();
      this.onFormationCancel();
      $gameParty.removeActor(actor.actorId());
      this._statusWindow.refresh();
    }
  };
  Scene_Menu.prototype.commandRemoveActorCancel = function() {
    this._formationCommandConfirmWindow.deselect();
    this._formationCommandConfirmWindow.close();
    this._formationCommandWindow.deselect();
    this._formationCommandWindow.close();
    this._statusWindow.activate();
  };
  Scene_Menu.prototype.onFormationOk = function() {
      var index = this._statusWindow.index();
      var actor = $gameParty.members()[index];
      var pendingIndex = this._statusWindow.pendingIndex();
      if (pendingIndex >= 0) {
          if (index != pendingIndex) {
            $gameParty.swapOrder(index, pendingIndex);
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.redrawItem(index);
          } else {
            if (actor.removableInMenu()) {
              var rect = this._statusWindow.itemRect(this._statusWindow.index());
              this._formationCommandWindow.x = this._statusWindow.x + rect.x +
                                                 rect.width / 2 -
                                                  this._formationCommandWindow.width / 2;
              this._formationCommandWindow.y = this._statusWindow.y + rect.y +
                                                  rect.height / 2
                                                  this._formationCommandWindow.height / 2;
              // this._statusWindow.deselect();
              this._formationCommandWindow.open();
              this._formationCommandWindow.select(0);
              this._formationCommandWindow.activate();
              return;
            }
          }
      } else {
          this._statusWindow.setPendingIndex(index);
      }
      this._statusWindow.activate();
  };
})();

````

## 效果

![效果](http://ww1.sinaimg.cn/mw690/a94a86cbjw1f3kpx3j7tbj20n40ietfs.jpg)