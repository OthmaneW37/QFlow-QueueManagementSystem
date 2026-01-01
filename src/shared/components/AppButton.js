import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

export const AppButton = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    size = 'md'
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                size === 'sm' && styles.small,
                disabled && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={[
                    styles.text,
                    variant === 'outline' && styles.outlineText,
                    variant === 'warning' && styles.warningText,
                    size === 'sm' && styles.smallText
                ]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    primary: {
        backgroundColor: theme.colors.primary
    },
    secondary: {
        backgroundColor: theme.colors.text.secondary
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary
    },
    danger: {
        backgroundColor: theme.colors.error
    },
    warning: {
        backgroundColor: theme.colors.accent, // Yellow/Orange
    },
    success: {
        backgroundColor: theme.colors.success // Green
    },
    disabled: {
        opacity: 0.5
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: theme.typography.fontSizes.md
    },
    warningText: {
        color: '#fff' // Or dark text if accent is light
    },
    outlineText: {
        color: theme.colors.primary
    },
    small: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        minHeight: 32
    },
    smallText: {
        fontSize: theme.typography.fontSizes.sm
    }
});
