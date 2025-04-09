// src/utils/avatarUtils.ts
export const stringToColor = (string: string): string => {
    let hash = 0;
    let i;

    /* Générer une couleur cohérente basée sur le texte */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
};

export const getAvatarProps = (username?: string | null) => {
    return {
        sx: {
            bgcolor: username ? stringToColor(username) : '#888888',
        },
        children: username ? username[0].toUpperCase() : 'U',
    };
};