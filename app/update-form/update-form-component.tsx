// app/form/page.js
'use client';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import { Building2, Clock, Hash, Plus, Zap, Target, ArrowLeft, Save, PenLine } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { toast } from "@/components/ui/use-toast";

// Zod validation schema
const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  ticketNumber: z.string().min(1, 'Ticket number is required'),
  openingTime: z.string().min(1, 'Opening time is required'),
  closingTime: z.string().min(1, 'Closing time is required'),
  jodiInfo: z.string().optional(),
  panelInfo: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function FormPage() {
  const [companies, setCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      ticketNumber: '',
      openingTime: '',
      closingTime: '',
      jodiInfo: '',
      panelInfo: ''
    }
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'companies'));
      const companiesData:any = [];
      querySnapshot.forEach((doc) => {
        companiesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch companies",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    if (companies.length >= 3 && !editingId) {
      toast({
        title: "Limit Reached",
        description: "You can only add up to 3 companies",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateDoc(doc(db, 'companies', editingId), {
          ...data,
          updatedAt: serverTimestamp()
        });
        toast({
          title: "Success",
          description: "Company updated successfully!",
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'companies'), {
          ...data,
          createdAt: serverTimestamp()
        });
        toast({
          title: "Success",
          description: "Company added successfully!",
        });
      }
      
      form.reset();
      fetchCompanies();
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: "Error",
        description: "Failed to save company. Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleEdit = (company:any) => {
    form.reset({
      name: company.name,
      ticketNumber: company.ticketNumber,
      openingTime: company.openingTime,
      closingTime: company.closingTime,
      jodiInfo: company.jodiInfo || '',
      panelInfo: company.panelInfo || ''
    });
    setEditingId(company.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-pulse">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-4 animate-fade-in">
              MANAGE COMPANIES
            </h1>
            <p className="text-xl text-purple-200 mb-8">Manage Your Business Information</p>
            
            <Link 
              href="/"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Display
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  {companies.length >= 3 && !editingId ? 'Select Company to Edit' : (editingId ? 'Edit Company Details' : 'Add New Company')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {companies.length >= 3 && !editingId ? (
                  <div className="space-y-4">
                    <p className="text-purple-200 mb-4">You have reached the maximum limit of 3 companies. Please select a company to edit:</p>
                    <div className="grid gap-4">
                      {companies.map((company: any) => (
                        <Button
                          key={company.id}
                          onClick={() => handleEdit(company)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-xl flex items-center justify-between"
                        >
                          <span className="font-semibold">{company.name}</span>
                          <PenLine className="w-5 h-5" />
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-purple-200 text-lg">Company Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          {...form.register('name')}
                          className="bg-white/5 border-purple-500/30 text-white placeholder-purple-300/50 text-lg h-12"
                          placeholder="Enter your company name"
                        />
                        <Building2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                      </div>
                      {form.formState.errors.name && (
                        <p className="text-red-400 text-sm">{form.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticketNumber" className="text-purple-200 text-lg">Ticket Number</Label>
                      <div className="relative">
                        <Input
                          id="ticketNumber"
                          {...form.register('ticketNumber')}
                          className="bg-white/5 border-purple-500/30 text-white placeholder-purple-300/50 text-lg h-12"
                          placeholder="Enter your ticket number"
                        />
                        <Hash className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                      </div>
                      {form.formState.errors.ticketNumber && (
                        <p className="text-red-400 text-sm">{form.formState.errors.ticketNumber.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="openingTime" className="text-purple-200 text-lg">Opening Time</Label>
                        <TimePickerInput
                          id="openingTime"
                          {...form.register('openingTime')}
                          className="bg-white/5 border-purple-500/30 text-white text-lg h-12"
                        />
                        {form.formState.errors.openingTime && (
                          <p className="text-red-400 text-sm">{form.formState.errors.openingTime.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="closingTime" className="text-purple-200 text-lg">Closing Time</Label>
                        <TimePickerInput
                          id="closingTime"
                          {...form.register('closingTime')}
                          className="bg-white/5 border-purple-500/30 text-white text-lg h-12"
                        />
                        {form.formState.errors.closingTime && (
                          <p className="text-red-400 text-sm">{form.formState.errors.closingTime.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jodiInfo" className="text-purple-200 text-lg">Jodi Information</Label>
                      <div className="relative">
                        <Textarea
                          id="jodiInfo"
                          {...form.register('jodiInfo')}
                          className="bg-white/5 border-purple-500/30 text-white placeholder-purple-300/50 text-lg min-h-[120px]"
                          placeholder="Enter your Jodi information"
                        />
                        <Zap className="absolute right-4 top-4 w-5 h-5 text-purple-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="panelInfo" className="text-purple-200 text-lg">Panel Information</Label>
                      <div className="relative">
                        <Textarea
                          id="panelInfo"
                          {...form.register('panelInfo')}
                          className="bg-white/5 border-purple-500/30 text-white placeholder-purple-300/50 text-lg min-h-[120px]"
                          placeholder="Enter your Panel information"
                        />
                        <Target className="absolute right-4 top-4 w-5 h-5 text-purple-400" />
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg h-12"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            {editingId ? 'Update Company' : 'Add Company'}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Companies List Section */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Existing Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {companies.map((company:any) => (
                    <div
                      key={company.id}
                      onClick={() => handleEdit(company)}
                      className="bg-white/5 border border-purple-500/30 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">{company.name}</h3>
                          <p className="text-purple-300 text-sm">Ticket: {company.ticketNumber}</p>
                          <p className="text-purple-300 text-sm">
                            Time: {company.openingTime} - {company.closingTime}
                          </p>
                        </div>
                        <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/30 transition-colors duration-300">
                          <PenLine className="w-4 h-4 text-purple-300" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}