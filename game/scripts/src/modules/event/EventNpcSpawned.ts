export class EventNPCSpawned {
    readonly DATADRIVEN_MIN_LEVEL_KEY = 'MinLevel';

    constructor() {
        ListenToGameEvent('npc_spawned', keys => this.OnNPCSpawned(keys), this);
    }

    private OnNPCSpawned(keys: GameEventProvidedProperties & NpcSpawnedEvent): void {
        if (GameRules.State_Get() < GameState.PRE_GAME) {
            Timers.CreateTimer(0.3, () => {
                this.OnNPCSpawned(keys);
            });
            return;
        }

        const npc = EntIndexToHScript(keys.entindex) as CDOTA_BaseNPC | undefined;
        if (!npc) {
            return;
        }

        // 英雄出生
        if (npc.IsRealHero() && keys.is_respawn === 0) {
            const hero = npc as CDOTA_BaseNPC_Hero;
            this.OnRealHeroSpawned(hero);
        }
    }

    /**
     * 英雄出生
     * @param hero
     */
    private OnRealHeroSpawned(hero: CDOTA_BaseNPC_Hero) {
        this.InitHeroAbility(hero);
    }

    /**
     * 遍历英雄的技能
     * @param hero 英雄
     */
    private InitHeroAbility(hero: CDOTA_BaseNPC_Hero) {
        // 遍历所有技能
        for (let index = 0; index < hero.GetAbilityCount(); index++) {
            let ability = hero.GetAbilityByIndex(index);

            // 检查该技能等级最低值
            if ('GetMinLevel' in ability && typeof ability.GetMinLevel == 'function') {
                // 如果存在GetMinLevel方法则直接调用
                if (ability.GetLevel() < ability.GetMinLevel()) {
                    ability.SetLevel(ability.GetMinLevel());
                }
            } else {
                // 如果是数据驱动文件则读取该技能key-value
                let kv = ability.GetAbilityKeyValues();
                if (this.DATADRIVEN_MIN_LEVEL_KEY in kv) {
                    let minLevel = Number(kv[this.DATADRIVEN_MIN_LEVEL_KEY]);
                    if (ability.GetLevel() < minLevel) {
                        ability.SetLevel(minLevel);
                    }
                }
            }
        }
    }
}
