"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Star,
  Zap,
  Filter,
  Building2,
  MessageCircle,
  Heart,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui/select";
import { Progress } from "../Components/ui/progress";
import companies from "../Components/Data/companiesData";

export default function JobPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("cultureScore");
  const [activeTab, setActiveTab] = useState("companies");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const filteredCompanies = useMemo(() => {
    const filtered = companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesIndustry =
        selectedIndustry === "all" || company.industry === selectedIndustry;
      const matchesLocation =
        selectedLocation === "all" ||
        company.location.includes(selectedLocation);

      return matchesSearch && matchesIndustry && matchesLocation;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "cultureScore":
          return b.cultureScore - a.cultureScore;
        case "workLifeBalance":
          return b.workLifeBalance - a.workLifeBalance;
        case "founded":
          return b.founded - a.founded;
        case "size":
          return b.size.localeCompare(a.size);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedIndustry, selectedLocation, sortBy]);

  const CompanyDetailModal = ({ company, onClose }) => {
    if (!company) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#fff1ed]">
          <div className="sticky top-0 bg-white border-b border-[#fff1ed] p-4 sm:p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#fff1ed]"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#caa057]">
                  {company.name}
                </h2>
                <p className="text-sm text-gray-500">{company.industry}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-2xl text-[#caa057] hover:text-[#b4924c]"
            >
              ×
            </Button>
          </div>

          <div className="p-4 sm:p-6 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[#caa057]">
                  About Company
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {company.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag, index) => (
                    <Badge key={index} className="bg-[#fff1ed] text-[#caa057]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[#caa057]">
                  Company Details
                </h3>
                <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-[#caa057]" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-[#caa057]" />
                    <span>{company.size}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-[#caa057]" />
                    <span>Founded in {company.founded}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-[#caa057]" />
                    <a href={company.website} className="text-[#caa057] hover:underline">
                      {company.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-[#caa057]" />
                    <span>{company.salaryRange}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Culture Score</span>
                  <span className="font-bold text-[#caa057]">
                    {company.cultureScore}/5.0
                  </span>
                </div>
                <Progress value={company.cultureScore * 20} className="h-3 bg-[#fff1ed] [&>div]:bg-[#caa057]" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Work-Life Balance</span>
                  <span className="font-bold text-green-600">
                    {company.workLifeBalance}/5.0
                  </span>
                </div>
                <Progress value={company.workLifeBalance * 20} className="h-3 bg-[#fff1ed] [&>div]:bg-green-500" />
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#fff1ed] p-4 sm:p-6 rounded-2xl border border-[#fff1ed] shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-[#caa057] mb-4 sm:mb-5 text-center">
                Get in Touch
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button className="flex items-center justify-center gap-2 py-3 w-full bg-gradient-to-r from-[#caa057] to-[#caa057] text-white font-medium rounded-xl hover:from-[#b4924c] hover:to-[#b4924c] shadow-md transition">
                  <Mail className="w-5 h-5" /> Contact HR
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2 py-3 w-full border border-[#caa057] text-[#caa057] font-medium rounded-xl hover:bg-[#fff1ed] transition">
                  <Phone className="w-5 h-5" /> Schedule Call
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2 py-3 w-full border border-[#caa057] text-[#caa057] font-medium rounded-xl hover:bg-[#fff1ed] transition">
                  <Globe className="w-5 h-5" /> Visit Website
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CompanyCard = ({ company }) => (
    <Card
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#fff1ed] bg-white rounded-2xl"
      onClick={() => setSelectedCompany(company)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <img
            src={company.logo || "/placeholder.svg"}
            alt={`${company.name} logo`}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-[#fff1ed]"
          />
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg group-hover:text-[#caa057] transition-colors font-semibold">
              {company.name}
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1 text-[#caa057]" />
              {company.location}
            </p>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-[#caa057] text-[#caa057]" />
                <span className="text-sm font-medium">{company.cultureScore}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                <span className="text-sm font-medium">{company.workLifeBalance}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {company.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {company.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} className="text-xs bg-[#fff1ed] text-[#caa057] hover:bg-[#fff1ed] transition-colors">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 p-2 bg-[#fff1ed] rounded-lg border border-[#fff1ed]">
            <Users className="w-4 h-4 text-[#caa057]" />
            <div>
              <p className="font-medium text-gray-900">{company.size}</p>
              <p className="text-gray-500">Team Size</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-[#fff1ed] rounded-lg border border-[#fff1ed]">
            <Calendar className="w-4 h-4 text-[#caa057]" />
            <div>
              <p className="font-medium text-gray-900">{company.founded}</p>
              <p className="text-gray-500">Founded</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button className="flex-1 rounded-lg font-medium bg-gradient-to-r from-[#caa057] to-[#caa057] text-white hover:from-[#b4924c] hover:to-[#b4924c] transition-all duration-300 shadow-md hover:shadow-lg">
            View Details
          </Button>
          <Button variant="outline" className="flex-1 border border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] flex items-center justify-center">
            <MessageCircle className="w-4 h-4 mr-2" /> Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#fff1ed]">
      <main className="container mx-auto px-3 sm:px-4 pb-12 pt-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
            <TabsList className="w-full md:w-auto h-10 sm:h-11 bg-white border border-[#fff1ed] rounded-xl">
              <TabsTrigger value="companies" className="flex items-center space-x-2 font-medium text-[#caa057]">
                <Building2 className="w-4 h-4" />
                <span>Companies ({filteredCompanies.length})</span>
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#caa057] shrink-0" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 border-[#fff1ed]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cultureScore">Best Culture</SelectItem>
                    <SelectItem value="workLifeBalance">Work-Life Balance</SelectItem>
                    <SelectItem value="founded">Recently Founded</SelectItem>
                    <SelectItem value="size">Company Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Companies Grid */}
          <TabsContent value="companies" className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
            {filteredCompanies.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#fff1ed] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-[#caa057]" />
                </div>
                <p className="text-gray-600 text-base sm:text-lg font-medium">
                  No companies found matching your criteria.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <CompanyDetailModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
    </div>
  );
}