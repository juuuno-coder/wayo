import { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import EventCard from '../../components/EventCard';
import { Event } from '../../types';

const categories = [
  { id: "all", name: "전체", emoji: "✨" },
  { id: "festival", name: "축제", emoji: "🎉" },
  { id: "exhibition", name: "박람회", emoji: "🏢" },
  { id: "art", name: "미술전시", emoji: "🎨" },
  { id: "concert", name: "공연", emoji: "🎵" },
  { id: "contest", name: "공모전", emoji: "🏆" },
];

const banners = [
  {
    id: 1,
    title: "2025 대한민국 축제 대축제",
    subtitle: "지금 바로 떠나보세요!",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200",
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "예술로 채우는 일상",
    subtitle: "전국 주요 전시회 가이드",
    image: "https://images.unsplash.com/photo-1492691523567-6170c3295db6?w=1200",
    color: "bg-purple-600",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchEvents = useCallback(async () => {
    try {
      let url = 'https://wayo.fly.dev/events?sort=latest';
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);

  const Header = () => (
    <View>
      {/* Banner Section */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} className="h-64 mb-6">
        {banners.map((banner) => (
          <View key={banner.id} className="w-screen relative">
            <Image source={{ uri: banner.image }} className="w-full h-full" resizeMode="cover" />
            <View className="absolute inset-0 bg-black/30" />
            <View className="absolute bottom-8 left-6">
              <Text className="text-white font-bold text-xs uppercase tracking-widest mb-2 opacity-80">Recommended</Text>
              <Text className="text-white font-black text-3xl mb-2">{banner.title}</Text>
              <Text className="text-white font-medium text-base opacity-90">{banner.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-6" contentContainerStyle={{ paddingRight: 32 }}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id)}
            className={`mr-4 items-center`}
            activeOpacity={0.7}
          >
            <View className={`w-16 h-16 rounded-3xl items-center justify-center mb-2 ${selectedCategory === cat.id ? 'bg-lime-500 shadow-md shadow-lime-200' : 'bg-white border border-gray-100'}`}>
              <Text className="text-2xl">{cat.emoji}</Text>
            </View>
            <Text className={`text-xs font-bold ${selectedCategory === cat.id ? 'text-gray-900' : 'text-gray-400'}`}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-6 mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-black text-gray-900">
          {selectedCategory === 'all' ? '진행중인 이벤트' : `${categories.find(c => c.id === selectedCategory)?.name} 모아보기`}
        </Text>
        <Text className="text-lime-600 font-bold bg-lime-50 px-3 py-1 rounded-full text-xs">
          {events.length}건
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#84CC16" />
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <View className="px-6">
              <EventCard event={item} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={Header}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#84CC16" />
          }
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-gray-400 font-bold">이벤트가 없습니다.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
