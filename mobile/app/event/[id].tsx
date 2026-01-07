import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Share } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Event } from '../../types';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`https://wayo.fly.dev/events/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setEvent(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `[가보자고] ${event?.title}\nhttps://wayo.fly.dev/events/${id}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const openWebsite = () => {
        if (event?.source_url) {
            Linking.openURL(event.source_url);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#84CC16" />
            </View>
        );
    }

    if (!event) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-gray-500 font-bold">이벤트를 찾을 수 없습니다.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{
                headerShown: true,
                title: '',
                headerTransparent: true,
                headerTintColor: '#fff',
                headerRight: () => (
                    <TouchableOpacity onPress={handleShare} className="bg-black/20 p-2 rounded-full backdrop-blur-md">
                        <Ionicons name="share-outline" size={24} color="white" />
                    </TouchableOpacity>
                )
            }} />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="relative h-96 w-full">
                    <Image
                        source={{ uri: event.image_url }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <View className="absolute bottom-6 left-6 right-6">
                        <View className="flex-row items-center mb-2">
                            <View className="bg-lime-500 px-3 py-1 rounded-full mr-2">
                                <Text className="text-white text-xs font-bold">{event.category}</Text>
                            </View>
                            {event.is_free && (
                                <View className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                                    <Text className="text-lime-400 text-xs font-bold">FREE</Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-white text-3xl font-black leading-tight drop-shadow-md">
                            {event.title}
                        </Text>
                    </View>
                </View>

                <View className="p-6 -mt-6 bg-white rounded-t-[32px]">
                    <View className="flex-row justify-between items-start mb-8">
                        <View className="space-y-4 flex-1">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
                                    <FontAwesome name="calendar" size={16} color="#4B5563" />
                                </View>
                                <View>
                                    <Text className="text-gray-400 text-xs font-bold">Date</Text>
                                    <Text className="text-gray-900 font-bold text-base">
                                        {event.start_date} ~ {event.end_date}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
                                    <FontAwesome name="map-marker" size={18} color="#4B5563" />
                                </View>
                                <View>
                                    <Text className="text-gray-400 text-xs font-bold">Location</Text>
                                    <Text className="text-gray-900 font-bold text-base">{event.location}</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
                                    <FontAwesome name="krw" size={16} color="#4B5563" />
                                </View>
                                <View>
                                    <Text className="text-gray-400 text-xs font-bold">Price</Text>
                                    <Text className="text-gray-900 font-bold text-base">{event.price}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Text className="text-xl font-black text-gray-900 mb-4">About Event</Text>
                    <Text className="text-gray-600 text-base leading-7 mb-8">
                        {event.description || "상세 설명이 없습니다."}
                    </Text>

                    {event.organizer && (
                        <View className="bg-gray-50 p-4 rounded-2xl mb-8">
                            <Text className="text-gray-400 text-xs font-bold mb-1">Organizer</Text>
                            <Text className="text-gray-900 font-bold">{event.organizer}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 pb-10 safe-area-pb">
                <TouchableOpacity
                    onPress={openWebsite}
                    className="w-full bg-gray-900 py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {event.source_url ? '웹사이트 방문하기' : '상세 정보 없음'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
