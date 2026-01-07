import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function MyPageScreen() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('auth_token');
            if (storedToken) {
                // Optimistic set
                setToken(storedToken);

                // Verify with backend
                const response = await fetch('https://wayo.fly.dev/users/me', {
                    headers: {
                        'Authorization': storedToken,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser({
                        email: userData.email,
                        nickname: userData.nickname || 'User',
                        avatarUrl: userData.avatar_url
                    });
                } else if (response.status === 401) {
                    // Invalid token
                    await handleLogout();
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
            return;
        }

        setLoggingIn(true);
        try {
            const response = await fetch('https://wayo.fly.dev/users/sign_in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    user: { return_secure_token: true, email, password }
                }),
            });

            if (response.ok) {
                const authHeader = response.headers.get('Authorization');
                if (authHeader) {
                    const jwt = authHeader.split('Bearer ')[1];
                    await SecureStore.setItemAsync('auth_token', jwt);
                    setToken(jwt);
                    setUser({ email, nickname: 'User' });
                    Alert.alert('로그인 성공', '환영합니다!');
                } else {
                    Alert.alert('오류', '토큰을 받아오지 못했습니다.');
                }
            } else {
                Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('오류', '네트워크 오류가 발생했습니다.');
        } finally {
            setLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('auth_token');
        setToken(null);
        setUser(null);
        Alert.alert('로그아웃', '로그아웃 되었습니다.');
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#84CC16" />
            </View>
        );
    }

    if (token) {
        // Logged In View
        return (
            <View className="flex-1 bg-gray-50">
                <View className="bg-white p-6 pt-12 pb-8 rounded-b-[32px] shadow-sm">
                    <View className="flex-row items-center mb-6">
                        <View className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden">
                            <Image
                                source={{ uri: user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.nickname || user?.email?.split('@')[0] || 'User'}&background=84CC16&color=fff` }}
                                className="w-full h-full"
                            />
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-gray-900">{user?.email || 'User'}</Text>
                            <Text className="text-gray-500">환영합니다!</Text>
                        </View>
                    </View>
                </View>

                <ScrollView className="p-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">내 활동</Text>
                    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <FontAwesome name="heart" size={18} color="#F87171" style={{ width: 24 }} />
                                <Text className="text-gray-700 font-medium ml-2">관심 이벤트</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={14} color="#D1D5DB" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between py-3">
                            <View className="flex-row items-center">
                                <FontAwesome name="ticket" size={18} color="#84CC16" style={{ width: 24 }} />
                                <Text className="text-gray-700 font-medium ml-2">내 티켓</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={14} color="#D1D5DB" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-lg font-bold text-gray-900 mb-4">설정</Text>
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <TouchableOpacity onPress={handleLogout} className="flex-row items-center justify-between py-3">
                            <View className="flex-row items-center">
                                <FontAwesome name="sign-out" size={18} color="#9CA3AF" style={{ width: 24 }} />
                                <Text className="text-gray-700 font-medium ml-2">로그아웃</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={14} color="#D1D5DB" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Login View
    return (
        <View className="flex-1 bg-white p-8 justify-center">
            <View className="items-center mb-10">
                <Text className="text-4xl font-black text-lime-600 mb-2">GABOJAGO</Text>
                <Text className="text-gray-400 font-bold">당신의 주말을 책임지는 이벤트 가이드</Text>
            </View>

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-500 font-bold mb-2 ml-1">이메일</Text>
                    <TextInput
                        className="bg-gray-50 p-4 rounded-xl text-gray-900 font-bold border border-gray-100"
                        placeholder="이메일을 입력하세요"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View>
                    <Text className="text-gray-500 font-bold mb-2 ml-1">비밀번호</Text>
                    <TextInput
                        className="bg-gray-50 p-4 rounded-xl text-gray-900 font-bold border border-gray-100"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loggingIn}
                    className={`bg-lime-600 p-4 rounded-xl items-center mt-4 shadow-lg shadow-lime-200 ${loggingIn ? 'opacity-70' : ''}`}
                >
                    {loggingIn ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">로그인</Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-400 font-medium">계정이 없으신가요? </Text>
                    <TouchableOpacity>
                        <Text className="text-lime-600 font-bold">회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
