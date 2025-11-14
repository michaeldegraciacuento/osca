import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

interface Props {
    token: string;
    email: string;
    name: string;
}

export default function SetPassword({ token, email, name }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
        token: token,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/verify-email-and-login');
    };

    return (
        <>
            <Head title="Set Your Password - OSCA" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome to OSCA!</CardTitle>
                        <CardDescription>
                            Set up your password to complete your account setup
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800">{name}</p>
                                    <p className="text-sm text-green-600 flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="pr-10"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="pr-10"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
                            </div>

                            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                                <p className="font-medium mb-1">Password requirements:</p>
                                <ul className="space-y-1">
                                    <li>• At least 8 characters long</li>
                                    <li>• Use a combination of letters and numbers</li>
                                    <li>• Avoid common passwords</li>
                                </ul>
                            </div>

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Setting up your account...' : 'Complete Setup & Login'}
                            </Button>
                        </form>

                        <div className="text-center mt-6 text-sm text-gray-600">
                            <p>By completing your setup, you agree to OSCA's terms of service and privacy policy.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
