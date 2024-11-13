-- التحقق من صلاحيات الوصول
local function checkAuth(token)
    return token == 'YOUR_SERVER_TOKEN' -- استبدل بتوكن الأمان الخاص بك
end

-- استقبال طلبات الAPI
RegisterNetEvent('webPanel:banPlayer')
AddEventHandler('webPanel:banPlayer', function(playerId, reason, duration)
    if not checkAuth(source) then return end
    
    -- كود الحظر
    local player = GetPlayerIdentifiers(playerId)
    -- أضف كود الحظر الخاص بك هنا
end)

RegisterNetEvent('webPanel:kickPlayer')
AddEventHandler('webPanel:kickPlayer', function(playerId, reason)
    if not checkAuth(source) then return end
    
    -- كود الطرد
    DropPlayer(playerId, reason)
end)

-- إرسال قائمة اللاعبين
AddEventHandler('playerConnecting', function()
    TriggerClientEvent('webPanel:updatePlayers', -1, GetPlayers())
end)

AddEventHandler('playerDropped', function()
    TriggerClientEvent('webPanel:updatePlayers', -1, GetPlayers())
end) 



set web_baseUrl "https://rw7-0.github.io/fivem/"
set web_allowedHosts "rw7-0.github.io"
setr webadmin_enable 1
set web_baseUrl "https://rw7-0.github.io/fivem/"

Config = {}
Config.WebsiteURL = 'https://rw7-0.github.io/fivem/'



