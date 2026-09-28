import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '../services/AuthService';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  visible: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  initialMode = 'login',
  onClose,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
  }, [initialMode, visible]);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await AuthService.signIn(email.trim(), password.trim());
      } else {
        await AuthService.signUp(email.trim(), password.trim());
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await AuthService.signInDemo();
      onClose();
    } catch (err: any) {
      setErrorMsg('Demo girişi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
        >
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {mode === 'login' ? 'Giriş Yap' : 'Kaydol'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Subtitle / Mode Toggle */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, mode === 'login' && styles.activeTab]}
                onPress={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
              >
                <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>
                  Giriş Yap
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, mode === 'register' && styles.activeTab]}
                onPress={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
              >
                <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Banner */}
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#EF4444" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {!isSupabaseConfigured() && (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={16} color="#0284C7" />
                <Text style={styles.infoText}>
                  Supabase anahtarları tanımlı değil. Giriş butonları Demo Modunda çalışacaktır.
                </Text>
              </View>
            )}

            {/* Inputs */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-posta Adresi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ornek@snapline.app"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Şifre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Demo Mode Direct Button */}
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={handleDemoLogin}
                disabled={loading}
              >
                <Ionicons name="flash-outline" size={16} color="#517688" />
                <Text style={styles.demoBtnText}>Demo Modunda Hızlı Başla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#517688',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    color: '#0369A1',
    fontSize: 12,
    flex: 1,
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  submitBtn: {
    backgroundColor: '#517688',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  demoBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  demoBtnText: {
    color: '#517688',
    fontSize: 14,
    fontWeight: '600',
  },
});
