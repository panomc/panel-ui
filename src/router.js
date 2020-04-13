export default [
    {
        path: '/',
        component: "pages/Dashboard.svelte"
    },
    {
        path: '/players',
        component: "pages/Players.svelte",
        children: [
            {
                path: '/add',
                component: "pages/PlayersAdd.svelte"
            },
            {
                path: '/remove',
                component: "pages/PlayersRemove.svelte"
            }
        ]
    }
]
