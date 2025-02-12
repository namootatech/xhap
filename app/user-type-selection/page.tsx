'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  MusicIcon,
  PenIcon,
  CalendarIcon,
  ShoppingBagIcon,
  UserIcon,
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '@/hooks/use-toast';

const userTypes = [
  {
    id: 'artist',
    name: 'Artist',
    icon: MusicIcon,
    description: 'I create and perform music',
  },
  {
    id: 'blogger',
    name: 'Blogger',
    icon: PenIcon,
    description: 'I write about music and the industry',
  },
  {
    id: 'events_manager',
    name: 'Events Manager',
    icon: CalendarIcon,
    description: 'I organize and manage events',
  },
  {
    id: 'merchandiser',
    name: 'Merchandiser',
    icon: ShoppingBagIcon,
    description: 'I sell music-related products',
  },
  {
    id: 'fan',
    name: 'Fan',
    icon: UserIcon,
    description: "I'm here to support and enjoy music",
  },
];

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSelection = async () => {
    if (!selectedType) {
      toast({
        title: 'Error',
        description: 'Please select a user type',
        variant: 'destructive',
      });
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({ user_type: selectedType })
        .eq('id', user.id);

      if (error) throw error;

      if (selectedType === 'artist') {
        router.push('/onboarding/basic-info');
      } else {
        router.push(`/onboarding/${selectedType}`);
      }
    } catch (error) {
      console.error('Error updating user type:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user type. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center px-4'>
      <div className='max-w-4xl w-full'>
        <h1 className='text-3xl font-bold text-white text-center mb-8'>
          Select Your User Type
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {userTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'ring-2 ring-red-500'
                  : 'hover:bg-zinc-800'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <CardHeader>
                <type.icon className='h-8 w-8 text-red-500 mb-2' />
                <CardTitle>{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{type.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='mt-8 flex justify-center'>
          <Button
            onClick={handleSelection}
            className='bg-red-600 hover:bg-red-700'
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
