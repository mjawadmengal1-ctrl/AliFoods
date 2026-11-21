import { memo, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '@/constants/theme';
interface ButtonProps { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean; icon?: keyof typeof Ionicons.glyphMap }
export const Button = memo(function Button({ title, onPress, disabled, secondary, icon }: ButtonProps) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary ? styles.secondary : null, disabled ? styles.disabled : null, pressed ? styles.pressed : null]}>{icon ? <Ionicons name={icon} size={20} color={secondary ? colors.primary : colors.white} /> : null}<Text style={[styles.buttonText, secondary ? { color: colors.primary } : null]}>{title}</Text></Pressable>;
});
interface IconButtonProps { name: keyof typeof Ionicons.glyphMap; onPress: () => void; label: string; badge?: number; dark?: boolean }
export const IconButton = memo(function IconButton({ name, onPress, label, badge, dark }: IconButtonProps) {
  return <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.iconButton, dark ? { backgroundColor: colors.primary } : null, pressed ? styles.pressed : null]}><Ionicons name={name} size={23} color={dark ? colors.white : colors.ink} />{badge ? <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View> : null}</Pressable>;
});
interface FieldProps extends TextInputProps { label: string }
export function Field({ label, ...props }: FieldProps) { return <View style={styles.fieldWrap}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={colors.subtle} {...props} style={[styles.input, props.multiline ? styles.multiline : null, props.style]} /></View>; }
interface SectionProps { title: string; subtitle?: string; action?: string; onPress?: () => void; children?: ReactNode }
export function Section({ title, subtitle, action, onPress, children }: SectionProps) { return <View style={styles.section}><View style={styles.sectionTop}><View style={{ flex: 1 }}><Text style={styles.sectionTitle}>{title}</Text>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}</View>{action ? <Pressable onPress={onPress} style={({ pressed }) => [styles.sectionAction, pressed ? styles.pressed : null]}><Text style={styles.actionText}>{action}</Text><Ionicons name="arrow-forward" size={16} color={colors.primary} /></Pressable> : null}</View>{children}</View>; }
interface QuantityProps { value: number; onChange: (value: number) => void }
export function Quantity({ value, onChange }: QuantityProps) { return <View style={styles.quantity}><IconButton name="remove" label="Decrease quantity" onPress={() => onChange(Math.max(0, value - 1))} /><Text style={styles.quantityText}>{value}</Text><IconButton name="add" label="Increase quantity" onPress={() => onChange(value + 1)} /></View>; }
interface NoticeProps { text: string; error?: boolean }
export function Notice({ text, error }: NoticeProps) { return <View style={[styles.notice, error ? { backgroundColor: colors.tinted } : null]}><Ionicons name={error ? 'alert-circle-outline' : 'information-circle-outline'} size={20} color={error ? colors.danger : colors.subtle} /><Text style={[styles.noticeText, error ? { color: colors.danger } : null]}>{text}</Text></View>; }
const styles = StyleSheet.create({
  button: { minHeight: 54, backgroundColor: colors.primary, borderRadius: radii.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: colors.tinted, borderWidth: 1, borderColor: colors.border }, disabled: { opacity: 0.45 }, pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] }, buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  iconButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm, backgroundColor: colors.surface },
  badge: { position: 'absolute', top: -4, right: -4, minWidth: 19, height: 19, paddingHorizontal: 4, backgroundColor: colors.yellow, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' }, badgeText: { fontSize: 11, fontWeight: '800', color: colors.ink },
  fieldWrap: { gap: spacing.sm }, label: { color: colors.ink, fontSize: 14, fontWeight: '600' }, input: { minHeight: 52, borderRadius: radii.sm, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.surface, padding: spacing.md, fontSize: 16, color: colors.ink }, multiline: { minHeight: 100, textAlignVertical: 'top' },
  section: { gap: spacing.md }, sectionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }, sectionTitle: { color: colors.ink, fontSize: 21, fontWeight: '800', letterSpacing: -0.5 }, subtitle: { fontSize: 14, color: colors.subtle, marginTop: 4 }, sectionAction: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 4 }, actionText: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  quantity: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.muted, borderRadius: radii.sm }, quantityText: { minWidth: 24, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.ink }, notice: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: radii.sm, backgroundColor: colors.muted }, noticeText: { flex: 1, fontSize: 14, lineHeight: 21, color: colors.subtle },
});
