import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Event } from '../types';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface EventCardProps {
    event: Event;
}

const getStatus = (start: string, end: string) => {
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);

    if (now < s) return { text: "D-" + Math.ceil((+s - +now) / (1000 * 60 * 60 * 24)), color: "bg-lime-500" };
    if (now > e) return { text: "종료", color: "bg-gray-400" };
    return { text: "진행중", color: "bg-red-500" };
};

const formatDate = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.getMonth() + 1}.${s.getDate()} ~ ${e.getMonth() + 1}.${e.getDate()}`;
};

export default function EventCard({ event }: EventCardProps) {
    const router = useRouter();
    const status = getStatus(event.start_date, event.end_date);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/event/${event.id}`)}
            className="bg-white rounded-[24px] mb-4 shadow-sm border border-gray-100 overflow-hidden"
        >
            <View className="relative">
                <Image
                    source={{ uri: event.image_url }}
                    className="w-full h-48 bg-gray-200"
                    resizeMode="cover"
                />
                <View className={`absolute top-3 left-3 px-2 py-1 rounded-full ${status.color}`}>
                    <Text className="text-white text-[10px] font-bold">{status.text}</Text>
                </View>
                {event.is_free && (
                    <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full">
                        <Text className="text-lime-600 text-[10px] font-bold">FREE</Text>
                    </View>
                )}
            </View>

            <View className="p-4">
                <View className="flex-row items-center mb-2">
                    <Text className="bg-lime-50 text-lime-600 text-[10px] font-bold px-2 py-1 rounded-lg mr-2 overflow-hidden">
                        {event.category}
                    </Text>
                    <Text className="text-gray-400 text-xs font-medium">
                        {event.region}
                    </Text>
                </View>

                <Text className="text-lg font-bold text-gray-900 mb-2 leading-tight" numberOfLines={2}>
                    {event.title}
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                        <FontAwesome name="calendar" size={12} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs ml-1 font-medium">
                            {formatDate(event.start_date, event.end_date)}
                        </Text>
                    </View>
                    <Text className="text-gray-900 font-bold text-sm">
                        {event.is_free ? '무료' : event.price}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
